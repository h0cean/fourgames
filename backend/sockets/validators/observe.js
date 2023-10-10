
const byGameId = (data) =>{
    const validationResult = JoiSocketSchemas.findRoomByIdSchema.validate(data);
    if (validationResult.error) {
      throw `find room schema problem: * ${validationResult.error} `;
    }
}


module.exports = {byGameId};