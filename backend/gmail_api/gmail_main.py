
from gmail_api import messenger


def gmailv1(client,mode,email_list,header,msg_body):

    for email in email_list:    
        message = messenger.create_message('me',email,header,msg_body)
        if mode == 'send':
            messenger.send_message(client,'me',message) 
            print(mode,'email completed')
        elif mode == 'draft':
            messenger.create_draft(client,'me',message)
            print(mode,'email completed')

        else:
            pass