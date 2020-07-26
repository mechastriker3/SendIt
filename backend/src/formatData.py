def format_form_data(inputDict):
    # creates and formats the initially job
    # sets status to 'pending' (other value of status: 'inProgress' , 'completed' )
    outputDict = {
        'senderID' : None ,
        'senderFirstName' : inputDict['senderFirstName'],
        'senderLastName' : inputDict['senderLastName'],
        'senderContact' : inputDict['senderContact'],
        'senderEmail' : inputDict["senderEmail"],
        'recipientFirstName' : inputDict['recipientFirstName'],
        'recipientLastName' : inputDict['recipientLastName'],
        'recipientContact' : inputDict['recipientContact'],
        'delivererID' : None,
        'parcelSize' : inputDict['parcelSize'],
        'fragile' : inputDict['fragile'],
        'comments' : inputDict['comments'],
        'pickUpAddress': {
            'street' : inputDict['pickUpAddress'],
            'unitNo' : inputDict['pickUpUnitNumber'],
            'postalNo' : inputDict['pickUpPostal']
        },

        'destinationAddress': {
            'street' : inputDict['destinationAddress'],
            'unitNo' : inputDict['destinationUnitNumber'],
            'postalNo' : inputDict['destinationPostal']
        },
        
        'senderFeedback': None,
        'senderRating': None,
        'delivererName': None,
        'delivererFeedback': None,
        'delivererRating': None,
        'delivererContactNo' : None

    }

    return outputDict

def format_user_data(inputDict):
    outputDict = {
        'contactNo': inputDict['contactNo']
    }
    return outputDict





