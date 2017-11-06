/**
 * Mostly a copy of https://github.com/naoufal/react-native-touch-id
 * @providesModule LocalAuth
 * @flow
 */
'use strict';

import { createError } from './error';
import { NativeModules } from 'react-native';

const { RNLocalAuth } = NativeModules;

function performAuth(opts) {
    return new Promise(async (resolve, reject) => {
        try {
            if (await RNLocalAuth.isInitialized()) {
                RNLocalAuth.authenticate(opts).
                then(() => resolve()).
                catch((e) => {
                  e.name = e.code;
                  reject(e);
                });
            } else {
                setTimeout(() => {
                    resolve(performAuth(opts));
                }, 1000);
            }
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    hasTouchID() {
        return Promise.reject(createError('RCTTouchIDNotSupported'))
    },

    isDeviceSecure() {
        return RNLocalAuth.isDeviceSecure()
    },

    authenticate(opts) {
        return performAuth(opts)
    }
};
