/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* global ExtensionAPI, ExtensionCommon, Services, XPCOMUtils */

this.aboutConfigPipPrefs = class extends ExtensionAPI {
  getAPI(context) {
    const EventManager = ExtensionCommon.EventManager;
    const extensionIDBase = context.extension.id.split("@")[0];
    const extensionPrefNameBase = `extensions.${extensionIDBase}.`;

    return {
      aboutConfigPipPrefs: {
        onPrefChange: new EventManager({
          context,
          name: "aboutConfigPipPrefs.onSiteOverridesPrefChange",
          register: (fire, name) => {
            const prefName = `${extensionPrefNameBase}${name}`;
            const callback = () => {
              fire.async(name).catch(() => {}); // ignore Message Manager disconnects
            };
            Services.prefs.addObserver(prefName, callback);
            return () => {
              Services.prefs.removeObserver(prefName, callback);
            };
          },
        }).api(),
        async getPref(name) {
          try {
            return Services.prefs.getBoolPref(
              `${extensionPrefNameBase}${name}`
            );
          } catch (_) {
            return undefined;
          }
        },
        async setPref(name, value) {
          Services.prefs.setBoolPref(`${extensionPrefNameBase}${name}`, value);
        },
      },
    };
  }
};
