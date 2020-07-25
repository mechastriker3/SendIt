import datetime

#Sample Response Templates
def get_templates(template_type):
    '''
    input:
    - template_type

    output:
    - template_str
    '''
    switcher = {

        'order_completed': 'backend/email_templates/order-completed.html',
        'testhtml': 'backend/email_templates/testhtml.html'

    }
    template_path = switcher.get(template_type,'backend/email_templates/error.txt')
    with open(template_path) as f:
        raw_template_str = f.read()

    return raw_template_str

