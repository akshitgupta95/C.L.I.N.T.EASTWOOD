const log = (data, logs) => {
    return new logs({
        time: new Date(),
        info: data.info,
        event: data.event,
        wid: data.wid,
        accuracy:data.accuracy,
        sid: data.sid
    }).save();
};

module.exports = log;