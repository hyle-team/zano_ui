export enum paths {
  addWallet = 'add-wallet',
  login = 'login',
  wallet = 'wallet',
  create = 'create',
  open = 'open',
  restore = 'restore',
  seedPhrase = 'seed-phrase',
  details = 'details',
  assignAlias = 'assign-alias',
  editAlias = 'edit-alias',
  transferAlias = 'transfer-alias',
  settings = 'settings',
  contacts = 'contacts',
  addContacts = 'add-contacts',
  editContacts = 'edit-contacts',
  contactSend = 'contact-send',
  import = 'import',
  deeplink = 'deeplink',
  uiKit = 'ui-kit'
}

export enum pathChildrenWallet {
  send = 'send',
  receive = 'receive',
  history = 'history',
  contracts = 'contracts',
  staking = 'staking'
}

export enum pathChildrenContracts {
  purchase = 'purchase'
}
