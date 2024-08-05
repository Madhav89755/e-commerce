function capitalizeString(inputString='a'){
    const outputString=inputString[0].toUpperCase()+inputString.slice(1).toLowerCase()
    return outputString
}
module.exports={
    capitalizeString
}