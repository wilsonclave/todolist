

module.exports.getDate = getDate;

function getDate(){
    const date = new Date();
       
    const options = {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };

    const today = date.toLocaleDateString('en-IT', options);

    return today;
}

module.exports.getDay = getDay;

function getDay(){
    const date = new Date();
       
    const options = {
        weekday: 'long'
    };

    const day = date.toLocaleDateString('en-IT', options);

    return day;
}

