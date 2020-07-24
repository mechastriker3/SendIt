from flask import Flask, jsonify, request, _request_ctx_stack
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from bson import json_util
from bson.son import SON
import json
from auth import AuthError, requires_auth
from formatData import format_form_data, format_user_data

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'send_it'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/send_it'

mongo = PyMongo(app)

# Database definitions
jobs = mongo.db.jobs

CORS(app)


# initializing gmail api
from gmail_api import gmail_main 
from gmail_api import api_methods
from googleapiclient.discovery import build
from gmail_api import templates
import datetime
# getting credentials for gmail api
creds = api_methods.get_credentials('all')

GMAIL = build('gmail', 'v1', credentials=creds)

# ENDPOINTS BELOW

@app.route('/', methods=['GET'])
def helloworld():
    print("Sever Online")
    return 'Server Online'

@app.route('/api/users/update-user-info', methods=['PUT','POST'])
@requires_auth
def update_user():
    # updates user info of current logged in user

    # for testing without login in
    # auth0ID = 'google-oauth2|117032759256070508051'

    auth0ID = _request_ctx_stack.top.current_user['sub']
    users = mongo.db.users
    result_count = users.find({'userID' : auth0ID}).count()
    
    data = request.get_json()['values']
    # data = {'contactNo': '939393939'}
    formatted_data = format_user_data(data)

    if (result_count == 0):
        formatted_data["userID"] = auth0ID
        user_id = users.insert_one(formatted_data).inserted_id
        print(user_id)
        print(type(user_id))
        return jsonify('user info added')
    elif (result_count == 1):
        result = users.find_one_and_update({'userID':auth0ID}, {'$set': formatted_data })
        print(result)
        print("one result found")
        return jsonify("user info updated")
    else:
        raise LookupError


@app.route('/api/users/current-user', methods=['GET'])
@requires_auth
def get_current_user_info():
    # auth0ID = 'google-oauth2|117032759256070508051'
    auth0ID = _request_ctx_stack.top.current_user['sub']
    users = mongo.db.users
    result = users.find({'userID':auth0ID})
    if (result.count() == 0):  
        data = {'contactNo': '-'}
        formatted_data = format_user_data(data)
        formatted_data["userID"] = auth0ID
        user_id = users.insert_one(formatted_data).inserted_id
        print(user_id)
        print(type(user_id))
        return jsonify([data])
    else:
        result_sanitized = json.loads(json_util.dumps(result))

        return jsonify(result_sanitized)


@app.route('/api/all-jobs', methods=['GET'])
@requires_auth
def get_all_jobs():
    # gets all jobs in the database
    result = jobs.find().sort([{ '$natural', -1 }])

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/all-jobs/<status>', methods=['GET'])
@requires_auth
def get_jobs_by_status_pending(status):
    # gets all jobs which status is pending for job listing
    result = jobs.find({'status' : status}).sort([{ '$natural', -1 }])

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/jobs/multi-status', methods=['GET'])
@requires_auth 
def get_all_jobs_by_multi_status():
    # uses a querystring 
    # gets all jobs in the database with the specified status1 & status2
    # example:  localhost:5000/api/all-jobs/multi-status?status1=accepted&status2=inProgress
    # use query param ?by=value to set to either get the requesterid or deliverer id

    auth0ID = _request_ctx_stack.top.current_user['sub']
    # uncomment me for testing without login
    # auth0ID = 'google-oauth2|117032759256070508051'
    status1 = request.args.get('status1')
    status2 = request.args.get('status2')

    
    if (status1 == None or status2 == None ):
        return 'No query string input'
    else:
        if (request.args.get('by') == 'requested') :
            result = jobs.find( {
                '$and' : [
                    {'senderID' : auth0ID},
                    {'$or' : [ {'status' : status1}, {'status' : status2} ]}
                ]
            } ).sort([{ '$natural', -1 }])
        elif (request.args.get('by') == 'delivered') :
            result = jobs.find( {
                '$and' : [
                    {'delivererID' : auth0ID},
                    {'$or' : [ {'status' : status1}, {'status' : status2} ]}
                ]
            } ).sort([{ '$natural', -1 }])
        else:
            return 'Wrong Query String'
    

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)



@app.route('/api/jobs/<any("pending", "accepted", "inProgress", "completed"):status>', methods=['GET'])
@requires_auth
def get_jobs_by_status(status):
     # NEW ENDPOINT !!!

    # Gets jobs with the specified <status> 
    # and is either requested by you or deliverered by you
    # uses query string to determine whether to get jobs requested by you or delivered by you
    # example1: /api/jobs/pending?by=requested
    # example2: /api/jobs/pending?by=delivered

    auth0ID = _request_ctx_stack.top.current_user['sub']

    # uncomment me for testing without login
    # auth0ID = 'google-oauth2|117032759256070508051'
    if (request.args.get('by') == 'requested') :
        result = jobs.find( {
            '$and' : [
                {'status' : status},
                {'senderID' : auth0ID}
            ]
        } ).sort([{ '$natural', -1 }])
    elif (request.args.get('by') == 'delivered') :
        result = jobs.find( {
            '$and' : [
                {'status' : status},
                {'delivererID' : auth0ID}
            ]
        } ).sort([{ '$natural', -1 }])
    else:
        return 'Wrong Query String'


    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/jobs-count', methods=['GET'])
@requires_auth
def get_jobs_count():
    auth0ID = _request_ctx_stack.top.current_user['sub']
    # uncomment me for testing without login
    # auth0ID = 'google-oauth2|117032759256070508051'

    
    jobs_posted_pending_count = jobs.count_documents( {
            '$and' : [
                {'status' : 'pending'},
                {'senderID' : auth0ID}
            ]
    } )
    
    jobs_posted_ongoing_count = jobs.count_documents( {
            '$and' : [
                {'$or' : [ {'status' : 'accepted'}, {'status' : 'inProgress'} ]},
                {'senderID' : auth0ID}
            ]
    } )
    
    jobs_accepted_count = jobs.count_documents( {
            '$and' : [
                {'$or' : [ {'status' : 'accepted'}, {'status' : 'inProgress'} ]},
                {'delivererID' : auth0ID}
            ]
    } )
    result = {
        'jobsPostedPendingCount': jobs_posted_pending_count,
        'jobsPostedOnGoingCount': jobs_posted_ongoing_count,
        'jobsAcceptedCount': jobs_accepted_count
    }

    return jsonify(result)


@app.route('/api/myfeedback', methods=['GET'])
@requires_auth
def get_my_feedback():
    auth0ID = _request_ctx_stack.top.current_user['sub']
    result = {}
    if (request.args.get('by') == 'requested') :
        # generates array of deliverer feedback and ratings
        match_query = {
            '$and' : [
                {'status' : 'completed'},
                {'senderID' : auth0ID}
            ]
        }
        
        feedback_subdocument = {
            'delivererFeedback':'$delivererFeedback',
            'delivererRating':'$delivererRating'
        }
        pipeline_data = [
            {'$match': match_query},
            {'$sort': SON([( '_id', -1 )])},
            {'$project': feedback_subdocument}
        ]
        fnrArray = jobs.aggregate(pipeline_data)

       
        result['fnrArray'] = fnrArray
        # print(result)
        result_sanitized = json.loads(json_util.dumps(result))
        return jsonify(result_sanitized)
    elif (request.args.get('by') == 'delivered') :
        # generates array of deliverer feedback and ratings
        match_query = {
            '$and' : [
                {'status' : 'completed'},
                {'delivererID' : auth0ID}
            ]
        }
        feedback_subdocument = {
            'senderFeedback':'$senderFeedback',
            'senderRating':'$senderRating',
            'senderID': '$senderID',
            'senderFirstName':'$senderFirstName',
            'senderLastName':'$senderLastName'

        }
        pipeline = [
            {'$match': match_query},
            {'$sort': SON([( '_id', -1 )])},
            {'$project': feedback_subdocument}
        ]

        fnrArray = jobs.aggregate(pipeline)

        # generate average rating from all delivered jobs that match query
        pipeline_avg = [
            {'$match': match_query}

        ]
        # result['avgRating'] = 
        result['fnrArray'] = fnrArray
        print(result)
        result_sanitized = json.loads(json_util.dumps(result))
        return jsonify(result_sanitized)
    else:
        return 'Wrong Query String'


@app.route('/api/feedback/<user_id>', methods=['GET'])
@requires_auth
def get_feedback_by_userId(user_id):
    # uses query string to determine whether to get jobs requested by you or delivered by you
    # query param ?by=requested or ?by=delivered
    # user_id = '117032759256070508051'
    auth0ID = 'google-oauth2|' + user_id
    if (request.args.get('by') == 'requested') :
        result = jobs.find( {
            '$and' : [
                {'status' : 'completed'},
                {'senderID' : auth0ID}
            ]
        } ).sort([{ '$natural', -1 }])
    elif (request.args.get('by') == 'delivered') :
        result = jobs.find( {
            '$and' : [
                {'status' : 'completed'},
                {'delivererID' : auth0ID}
            ]
        } ).sort([{ '$natural', -1 }])
    else:
        return 'Wrong Query String'


    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/my-avg-rating', methods=['GET'])
@requires_auth
def get_my_avg_rating():
    # uses query string to determine whether to get jobs requested by you or delivered by you
    # query param ?by=requested or ?by=delivered
    
    auth0ID = _request_ctx_stack.top.current_user['sub']
    # auth0ID = 'google-oauth2|117032759256070508051'
    if (request.args.get('by') == 'requested') :
        match_query = {
            '$and' : [
                {'status' : 'completed'},
                {'senderID' : auth0ID}
            ]
        }
        # generate average rating from all requested jobs that match query
        pipeline_avg = [
            {'$match': match_query},
            {'$group': {
                '_id': None,
                'avgRating': { '$avg': '$delivererRating' }
            }}
        ]
        result = jobs.aggregate(pipeline_avg)
        result_sanitized = json.loads(json_util.dumps(result))
        print('requested')
        print(result_sanitized)
        if result_sanitized:
            return jsonify(result_sanitized[0])
        else:
            return jsonify({"id":None,"avgRating":None})

    elif (request.args.get('by') == 'delivered') :
        # generates array of deliverer feedback and ratings
        match_query = {
            '$and' : [
                {'status' : 'completed'},
                {'delivererID' : auth0ID}
            ]
        }
        pipeline_avg = [
            {'$match': match_query},
            {'$group': {
                '_id': None,
                'avgRating': { '$avg': '$senderRating' }
            }}
        ]
        result = jobs.aggregate(pipeline_avg)
        result_sanitized = json.loads(json_util.dumps(result))
        # print(result_sanitized)
        if result_sanitized:
            return jsonify(result_sanitized[0])
        else:
            return jsonify({"id":None,"avgRating":None})
    else:
        return 'Wrong Query String'


@app.route('/api/avg-rating/<user_id>', methods=['GET'])
@requires_auth
def get_avg_rating_by_userId(user_id):
    # uses query string to determine whether to get jobs requested by you or delivered by you
    # query param ?by=requested or ?by=delivered
    # user_id = '117032759256070508051'
    auth0ID = 'google-oauth2|' + user_id
    if (request.args.get('by') == 'requested') :
        match_query = {
            '$and' : [
                {'status' : 'completed'},
                {'senderID' : auth0ID}
            ]
        }
        # generate average rating from all requested jobs that match query
        pipeline_avg = [
            {'$match': match_query},
            {'$group': {
                '_id': '$senderID',
                'avgRating': { '$avg': '$delivererRating' }
            }}
        ]
        result = jobs.aggregate(pipeline_avg)
        result_sanitized = json.loads(json_util.dumps(result))
        if result_sanitized:
            return jsonify(result_sanitized[0])
        else:
            return jsonify({"id":None,"avgRating":None})

    elif (request.args.get('by') == 'delivered') :
        # generates array of deliverer feedback and ratings
        match_query = {
            '$and' : [
                {'status' : 'completed'},
                {'delivererID' : auth0ID}
            ]
        }
        pipeline_avg = [
            {'$match': match_query},
            {'$group': {
                '_id': '$delivererID',
                'avgRating': { '$avg': '$senderRating' }
            }}
        ]
        result = jobs.aggregate(pipeline_avg)
        result_sanitized = json.loads(json_util.dumps(result))
        if result_sanitized:
            return jsonify(result_sanitized[0])
        else:
            return jsonify({"id":None,"avgRating":None})
    else:
        return 'Wrong Query String'


@app.route('/api/one-job/<ObjectId:job_id>', methods=['GET'])
@requires_auth
def get_jobs_by_oId(job_id):
    # gets one job with specific jobid

    

    result = jobs.find_one_or_404(job_id)

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/one-job/<ObjectId:job_id>', methods=['DELETE'])
@requires_auth
def delete_jobs_by_oId(job_id):
    # gets one job with specific jobid

    

    jobs.delete_one({'_id':job_id})

    return jsonify('Job deleted')


@app.route('/api/one-job/update-sender-feedback/<ObjectId:job_id>', methods=['POST'])
@requires_auth
def update_sender_feedback_jobs_by_oId(job_id):
    # updates feedback for one job with specific jobid

    
    data = request.get_json()['values']
    update_feedback_dic = {
        'senderFeedback': data['senderFeedback'],
        'senderRating': float(data['senderRating'])
    }
    result = jobs.find_one_and_update({'_id':job_id}, {'$set':update_feedback_dic})

    result_sanitized = json.loads(json_util.dumps(result))
    
    return jsonify(result_sanitized)


@app.route('/api/one-job/update-deliverer-feedback/<ObjectId:job_id>', methods=['POST'])
@requires_auth
def update_deliverer_feedback_jobs_by_oId(job_id):
    # updates feedback for one job with specific jobid

    
    data = request.get_json()['values']
    update_feedback_dic = {
        'delivererFeedback': data['delivererFeedback'],
        'delivererRating': float(data['delivererRating'])
    }
    result = jobs.find_one_and_update({'_id':job_id}, {'$set':update_feedback_dic})

    result_sanitized = json.loads(json_util.dumps(result))
    
    return jsonify(result_sanitized)

    
@app.route('/api/one-job/update-status/<ObjectId:job_id>/<new_status>', methods=['PUT','POST'])
@requires_auth
def update_jobs_status_by_oId(job_id, new_status):
    # updates the status of a job to <new_status> using the job_id of the job 
    print(type(job_id))
    print(job_id)
    

    result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status}})
    print(result)
    print(type(result))

    # result_sanitized = json.loads(json_util.dumps(result))

    # return jsonify(result_sanitized)
    return jsonify('Job Updated')


@app.route('/api/one-job/update-status-id/<ObjectId:job_id>/<new_status>', methods=['PUT','POST'])
@requires_auth
def update_jobs_deliverer_and_status__by_oId(job_id, new_status):
    # updates the status of a job to <new_status> using the job_id of the job
    # if <new_status> == inProgress, also updates the delivererID to the auth0Id of the current user
    # if <new_status> == pending, updates the delivererID back to the null
    

    auth0ID = _request_ctx_stack.top.current_user['sub']
    # for testing without login in
    # auth0ID = 'google-oauth2|117032759256070508051'
    
    if (new_status == 'pending'):
        result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status, 'delivererID':None} } )
        return jsonify('Job Status Updated to: ' + new_status)
    elif (new_status == 'accepted'):
        data = request.get_json()['values']
        delivererName = data['delivererName']
        delivererContactNo = data['delivererContactNo']
        result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status, 'delivererID':auth0ID, 'delivererName':delivererName, 'delivererContactNo':delivererContactNo} } )
        return jsonify('Job Status Updated to: ' + new_status)
    elif (new_status == 'inProgress'): 
        result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status}})
        return jsonify('Job Status Updated to: ' + new_status)
    elif (new_status == 'completed'):
        result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status}})
        # print(result)

        user_email = result['senderEmail']
        user_name = result['senderFirstName'] + result['senderLastName']

        user_email = result['senderEmail']
        user_name = result['senderFirstName'] + result['senderLastName']
        
        pickUpStreet = result['pickUpAddress']['street']
        pickUpUnitNo = result['pickUpAddress']['unitNo']
        pickUpPostalNo = result['pickUpAddress']['postalNo']
        pickUpAddress = pickUpStreet + ' ' + pickUpUnitNo + ' | Singapore' + pickUpPostalNo

        destinationStreet = result['destinationAddress']['street']
        destinationUnitNo = result['destinationAddress']['unitNo']
        destinationPostalNo = result['destinationAddress']['postalNo']
        destinationAddress = destinationStreet + ' ' + destinationUnitNo + ' | Singapore ' + destinationPostalNo


        msg_body = templates.get_templates(template_type='order-completed').replace('##name##', user_name).replace('##pickUpAddress##', pickUpAddress).replace('##destinationAddress##', destinationAddress)
        gmail_main.gmailv1(client=GMAIL,mode='send',email_list=[user_email],header="(SendIt) YOUR REQUESTED JOB HAS BEEN COMPLETED",msg_body=msg_body)

        
        # gmail_main.gmailv1(client=GMAIL,mode='send',email_list=['shadowreaper313@gmail.com'],header="I COME FROM FLASK",msg_body='THIS IS THE SAMPLE MESSAGE')
        return jsonify('Job Updated to: {} and Completion Email sent to Job Requester'.format(new_status))

    else:
        return jsonify('Error: invalid status update')
    # print(result)

    # result_sanitized = json.loads(json_util.dumps(result))

    # return jsonify(result_sanitized)
  


@app.route('/api/jobs', methods=['POST'])
@requires_auth
def add_job():
    # post a job and sets the 'senderID' to the auth0Id of the current user
     
    data = request.get_json()['values']
    formatted_data = format_form_data(data)
    auth0ID = _request_ctx_stack.top.current_user['sub']

    formatted_data['status'] = 'pending'
    formatted_data['senderID'] = auth0ID

    print(formatted_data)
    
    # return "test success"
    
    job_id = jobs.insert_one(formatted_data).inserted_id
    print(job_id)
    print(type(job_id))
    return 'Job Added'


#Create email with template and send or draft
@app.route('/api/extapi/gmail/<mode>/<template_type>', methods = ['POST'])
def gmail_send(mode,template_type):
    global GMAIL
    email_list = request.get_json()
    print(email_list)
    text = templates.get_templates(template_type=template_type)
    test_email_list = []
    if mode == 'send':
        gmail_main.gmailv1(client=GMAIL,mode='send',email_list=email_list,header="",msg_body=text)
        print('message sent')
    elif mode == 'draft':
        gmail_main.gmailv1(client=GMAIL,mode='draft',email_list=test_email_list,header="",msg_body=text)
        print('message draft')
    return ("ok")


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


if __name__ == '__main__':
    app.run(debug=True, host='localhost',port=5000)
