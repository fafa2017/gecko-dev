/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* global AppConstants, ChromeUtils, ExtensionAPI, Services */

ChromeUtils.defineModuleGetter(
  this,
  "KEYBOARD_CONTROLS",
  "resource://gre/modules/PictureInPictureControls.jsm"
);

ChromeUtils.defineModuleGetter(
  this,
  "TOGGLE_POLICIES",
  "resource://gre/modules/PictureInPictureControls.jsm"
);

const TOGGLE_ENABLED_PREF =
  "media.videocontrols.picture-in-picture.video-toggle.enabled";

/**
 * This API is expected to be running in the parent process.
 */
this.pictureInPictureParent = class extends ExtensionAPI {
  getAPI(context) {
    return {
      pictureInPictureParent: {
        setOverrides(overrides) {
          // The Picture-in-Picture toggle is only implemented for Desktop, so make
          // this a no-op for non-Desktop builds.
          if (AppConstants.platform == "android") {
            return;
          }

          Services.ppmm.sharedData.set(
            "PictureInPicture:SiteOverrides",
            overrides
          );
        },
      },
    };
  }
};

/**
 * This API is expected to be running in a content process - specifically,
 * the WebExtension content process that the background scripts run in. We
 * split these out so that they can return values synchronously to the
 * background scripts.
 */
this.pictureInPictureChild = class extends ExtensionAPI {
  getAPI(context) {
    return {
      pictureInPictureChild: {
        getKeyboardControls() {
          // The Picture-in-Picture toggle is only implemented for Desktop, so make
          // this return nothing for non-Desktop builds.
          if (AppConstants.platform == "android") {
            return Cu.cloneInto({}, context.cloneScope);
          }

          return Cu.cloneInto(KEYBOARD_CONTROLS, context.cloneScope);
        },
        getPolicies() {
          // The Picture-in-Picture toggle is only implemented for Desktop, so make
          // this return nothing for non-Desktop builds.
          if (AppConstants.platform == "android") {
            return Cu.cloneInto({}, context.cloneScope);
          }

          return Cu.cloneInto(TOGGLE_POLICIES, context.cloneScope);
        },
      },
    };
  }
};
