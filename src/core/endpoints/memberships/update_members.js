/* @flow */

import {
  AddMembers,
  UpdateMembers,
  MembersInput,
  MembersListResponse,
  ModulesInject,
} from '../../flow_interfaces';
import operationConstants from '../../constants/operations';

function prepareMessagePayload(modules, messagePayload) {
  let stringifiedPayload = JSON.stringify(messagePayload);

  return stringifiedPayload;
}

export function getOperation(): string {
  return operationConstants.PNUpdateMembersOperation;
}

export function validateParams(
  modules: ModulesInject,
  incomingParams: MembersInput
) {
  let { spaceId, users } = incomingParams;

  if (!spaceId) return 'Missing spaceId';
  if (!users) return 'Missing users';
}

export function getURL(
  modules: ModulesInject,
  incomingParams: MembersInput
): string {
  let { config } = modules;

  return `/v1/objects/${config.subscribeKey}/spaces/${incomingParams.spaceId}/users`;
}

export function patchURL(
  modules: ModulesInject,
  incomingParams: MembersInput
): string {
  let { config } = modules;

  return `/v1/objects/${config.subscribeKey}/spaces/${incomingParams.spaceId}/users`;
}

export function usePatch() {
  return true;
}

export function getRequestTimeout({ config }: ModulesInject) {
  return config.getTransactionTimeout();
}

export function isAuthSupported() {
  return true;
}

export function prepareParams(
  modules: ModulesInject,
  incomingParams: MembersInput
): Object {
  const { include, limit, page } = incomingParams;
  const params = {};

  if (limit) {
    params.limit = limit;
  }

  if (include) {
    let includes = [];

    if (include.totalCount) {
      params.count = true;
    }

    if (include.customFields) {
      includes.push('custom');
    }

    if (include.spaceFields) {
      includes.push('space');
    }

    if (include.customSpaceFields) {
      includes.push('space.custom');
    }

    let includesString = includes.join(',');

    if (includesString.length > 0) {
      params.include = includesString;
    }
  }

  if (page) {
    if (page.next) {
      params.start = page.next;
    }
    if (page.prev) {
      params.end = page.prev;
    }
  }

  return params;
}

export function patchPayload(
  modules: ModulesInject,
  incomingParams: MembersInput
): string {
  const { addMembers, updateMembers, removeMembers, users } = incomingParams;
  let payload = {};

  if (addMembers && addMembers.length > 0) {
    payload.add = [];

    addMembers.forEach((addMember) => {
      let currentAdd: AddMembers = { id: addMember.id };

      if (addMember.custom) {
        currentAdd.custom = addMember.custom;
      }

      payload.add.push(currentAdd);
    });
  }

  if (updateMembers && updateMembers.length > 0) {
    payload.update = [];

    updateMembers.forEach((updateMember) => {
      let currentUpdate: UpdateMembers = { id: updateMember.id };

      if (updateMember.custom) {
        currentUpdate.custom = updateMember.custom;
      }

      payload.update.push(currentUpdate);
    });
  }

  // if users is present then it is an update
  if (users && users.length > 0) {
    payload.update = payload.update || [];

    users.forEach((updateMember) => {
      let currentUpdate: UpdateMembers = { id: updateMember.id };

      if (updateMember.custom) {
        currentUpdate.custom = updateMember.custom;
      }

      payload.update.push(currentUpdate);
    });
  }

  if (removeMembers && removeMembers.length > 0) {
    payload.remove = [];

    removeMembers.forEach((removeMemberId) => {
      payload.remove.push({ id: removeMemberId });
    });
  }

  return prepareMessagePayload(modules, payload);
}

export function handleResponse(
  modules: ModulesInject,
  membersResponse: Object
): MembersListResponse {
  return membersResponse;
}