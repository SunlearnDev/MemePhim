const useragent = require('useragent');

const getDeviceInfo = async ({deviceId}) => {
    const agent = useragent.parse(deviceId);
    return {
        browser: agent.toAgent(),
        os: agent.os.toString(),
        device: agent.device.toString()
    };
}

const getstring = async ({browser, os, device}) => {
    return device = `${browser} - ${os} - ${device}`;
}

module.exports = {
    getDeviceInfo,
    getstring
};