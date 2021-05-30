const log = (data, logs) => {
    return new logs({
        time: new Date(),
        info: data.info,
        wid: data.wid
    }).save();
};

module.exports = log;