import base64
import os
from email.mime.text import MIMEText
from email.mime.audio import MIMEAudio
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
import mimetypes
from googleapiclient import errors
import email.encoders

def create_message(sender, to, subject, message_text, cc=None):
  """Create a message for an email.

  Input:
  - sender: Email address of the sender.
  - to: Email address of the receiver.
  - subject: The subject of the email message.
  - message_text: The text of the email message.

  Output:
  - An object containing a base64url encoded email object.
  """
  message = MIMEText(message_text,'html')
  message['to'] = to
  if cc == None:
    pass
  else:
    message['cc'] = cc
  message['from'] = sender
  message['subject'] = subject
  raw = base64.urlsafe_b64encode(message.as_bytes())
  raw = raw.decode()
  body = {'raw': raw}
  return body


def create_message_with_attachment(sender, to, subject, message_text, file):
  message = MIMEMultipart()
  message['to'] = to
  message['from'] = sender
  message['subject'] = subject

  msg = MIMEText(message_text)
  message.attach(msg)

  content_type, encoding = mimetypes.guess_type(file)

  if content_type is None or encoding is not None:
    content_type = 'application/octet-stream'
  main_type, sub_type = content_type.split('/', 1)
  if main_type == 'text':
    fp = open(file, 'rb')
    msg = MIMEText(fp.read(), _subtype=sub_type)
    fp.close()
  elif main_type == 'image':
    fp = open(file, 'rb')
    msg = MIMEImage(fp.read(), _subtype=sub_type)
    fp.close()
  elif main_type == 'audio':
    fp = open(file, 'rb')
    msg = MIMEAudio(fp.read(), _subtype=sub_type)
    fp.close()
  else:
    fp = open(file, 'rb')
    msg = MIMEBase(main_type, sub_type)
    msg.set_payload(fp.read())
    fp.close()
  filename = os.path.basename(file)
  msg.add_header('Content-Disposition', 'attachment', filename=filename)
  email.encoders.encode_base64(msg)
  message.attach(msg)

  return {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}


def create_draft(service, user_id, message_body):
  """Create and insert a draft email. Print the returned draft's message and id.

  Input:
  - service: Authorized Gmail API service instance.
  - user_id: User's email address. The special value "me"
  - can be used to indicate the authenticated user.
  - message_body: The body of the email message, including headers.

  Output:
  - Draft object, including draft id and message meta data.
  """
  try:
    message = {'message': message_body}
    draft = service.users().drafts().create(userId=user_id, body=message).execute()
  

    print ('Draft id: %s\nDraft message: %s' % (draft['id'], draft['message']))

    return draft
  except errors.HttpError as error:
    print ('An error occurred: %s' % error)
    return None


def send_message(service,user_id, message):
  """Send an email message.
  Input:
  - service: Authorized Gmail API service instance.
  - user_id: User's email address. The special value "me"
  - can be used to indicate the authenticated user.
  - message: Message to be sent.
  Output:
  - Sent Message.
  """
  try:
    message = (service.users().messages().send(userId=user_id, body=message).execute())
    print('Message Sent')
    print('Message Id: ', message['id'],'\n')
    return message
  except errors.HttpError as error:
    print('An error occurred: %s' % error)