import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request



def get_credentials(scope='read'):
    # Input: name of Gmail API service instance
    # Output: Authorized Gmail API service instance
    # Default scope is read if nothing is passed into scope parameter
    # If modifying scope, delete the token file with .pickle extension
    creds_path = 'creds/'

    switcher = {
        'read' : 'https://www.googleapis.com/auth/gmail.readonly',
        'write': 'https://www.googleapis.com/auth/gmail.compose	',
        'send': 'https://www.googleapis.com/auth/gmail.send',
        'modify': 'https://www.googleapis.com/auth/gmail.modify',
        'all': 'https://mail.google.com/'
    }
    
    scope_url = switcher.get(scope, "Invalid scope")

    SCOPES = [scope_url]

    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(creds_path + 'token.pickle'):
        with open(creds_path + 'token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                creds_path + 'credentials.json', SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open(creds_path + 'token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    
    return creds




 





# results = name.users().labels().list(userId='me').execute()
# labels = results.get('labels', [])

# if not labels:
#     print('No labels found.')
# else:
#     print('Labels:')
#     for label in labels:
#         print(label['name'],label['id'])