const getOtherMembers = (members, userId) => {
    return members.find((member) => member._id.toString() !== userId.toString())
}

const getBase64 = (file) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export {getOtherMembers, getBase64}

