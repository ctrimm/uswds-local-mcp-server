/**
 * USWDS Icon Database
 * Based on https://designsystem.digital.gov/components/icon/
 */

export interface IconInfo {
  name: string;
  category: string;
  keywords: string[];
  usage: string;
}

export const USWDS_ICONS: Record<string, IconInfo> = {
  // Alerts & Messaging
  'check': {
    name: 'check',
    category: 'alerts',
    keywords: ['success', 'confirm', 'complete', 'done', 'valid'],
    usage: 'Indicate success, completion, or validation'
  },
  'check_circle': {
    name: 'check_circle',
    category: 'alerts',
    keywords: ['success', 'confirm', 'complete', 'done', 'valid'],
    usage: 'Success state or completed status with emphasis'
  },
  'close': {
    name: 'close',
    category: 'alerts',
    keywords: ['cancel', 'exit', 'dismiss', 'delete', 'remove'],
    usage: 'Close dialogs, dismiss alerts, remove items'
  },
  'error': {
    name: 'error',
    category: 'alerts',
    keywords: ['warning', 'alert', 'danger', 'invalid'],
    usage: 'Indicate errors or validation failures'
  },
  'warning': {
    name: 'warning',
    category: 'alerts',
    keywords: ['alert', 'caution', 'attention'],
    usage: 'Show warnings or cautionary messages'
  },
  'info': {
    name: 'info',
    category: 'alerts',
    keywords: ['information', 'help', 'about'],
    usage: 'Informational messages or help text'
  },

  // Navigation
  'arrow_back': {
    name: 'arrow_back',
    category: 'navigation',
    keywords: ['back', 'previous', 'return', 'left'],
    usage: 'Navigate to previous page or step'
  },
  'arrow_forward': {
    name: 'arrow_forward',
    category: 'navigation',
    keywords: ['next', 'forward', 'continue', 'right'],
    usage: 'Navigate to next page or step'
  },
  'arrow_upward': {
    name: 'arrow_upward',
    category: 'navigation',
    keywords: ['up', 'scroll', 'top'],
    usage: 'Scroll to top or move upward'
  },
  'arrow_downward': {
    name: 'arrow_downward',
    category: 'navigation',
    keywords: ['down', 'scroll', 'bottom', 'expand'],
    usage: 'Scroll down or expand content'
  },
  'expand_more': {
    name: 'expand_more',
    category: 'navigation',
    keywords: ['dropdown', 'chevron', 'more', 'show'],
    usage: 'Expand dropdowns or show more content'
  },
  'expand_less': {
    name: 'expand_less',
    category: 'navigation',
    keywords: ['collapse', 'chevron', 'less', 'hide'],
    usage: 'Collapse sections or hide content'
  },
  'menu': {
    name: 'menu',
    category: 'navigation',
    keywords: ['hamburger', 'nav', 'navigation', 'sidebar'],
    usage: 'Toggle mobile navigation menu'
  },
  'more_vert': {
    name: 'more_vert',
    category: 'navigation',
    keywords: ['options', 'menu', 'actions', 'kebab'],
    usage: 'Show more options or actions menu'
  },
  'more_horiz': {
    name: 'more_horiz',
    category: 'navigation',
    keywords: ['options', 'menu', 'actions'],
    usage: 'Horizontal options menu'
  },

  // Actions
  'add': {
    name: 'add',
    category: 'actions',
    keywords: ['plus', 'create', 'new'],
    usage: 'Add new items or create content'
  },
  'add_circle': {
    name: 'add_circle',
    category: 'actions',
    keywords: ['plus', 'create', 'new'],
    usage: 'Add action with emphasis'
  },
  'remove': {
    name: 'remove',
    category: 'actions',
    keywords: ['minus', 'delete', 'subtract'],
    usage: 'Remove items or reduce quantity'
  },
  'edit': {
    name: 'edit',
    category: 'actions',
    keywords: ['pencil', 'modify', 'change', 'update'],
    usage: 'Edit or modify content'
  },
  'delete': {
    name: 'delete',
    category: 'actions',
    keywords: ['trash', 'remove', 'destroy'],
    usage: 'Delete or remove items permanently'
  },
  'save': {
    name: 'save',
    category: 'actions',
    keywords: ['disk', 'store', 'keep'],
    usage: 'Save changes or data'
  },
  'search': {
    name: 'search',
    category: 'actions',
    keywords: ['find', 'magnify', 'look'],
    usage: 'Search functionality'
  },
  'refresh': {
    name: 'refresh',
    category: 'actions',
    keywords: ['reload', 'sync', 'update'],
    usage: 'Refresh or reload content'
  },
  'settings': {
    name: 'settings',
    category: 'actions',
    keywords: ['gear', 'config', 'preferences', 'options'],
    usage: 'Access settings or configuration'
  },
  'share': {
    name: 'share',
    category: 'actions',
    keywords: ['send', 'export', 'forward'],
    usage: 'Share content or data'
  },
  'print': {
    name: 'print',
    category: 'actions',
    keywords: ['printer', 'output'],
    usage: 'Print document or page'
  },
  'download': {
    name: 'download',
    category: 'actions',
    keywords: ['save', 'export', 'get'],
    usage: 'Download files or data'
  },
  'upload': {
    name: 'upload',
    category: 'actions',
    keywords: ['import', 'attach', 'send'],
    usage: 'Upload files or data'
  },
  'attach_file': {
    name: 'attach_file',
    category: 'actions',
    keywords: ['clip', 'file', 'upload'],
    usage: 'Attach files to forms or messages'
  },

  // Communication
  'mail': {
    name: 'mail',
    category: 'communication',
    keywords: ['email', 'envelope', 'message'],
    usage: 'Email or messaging'
  },
  'email': {
    name: 'email',
    category: 'communication',
    keywords: ['mail', 'message', 'contact'],
    usage: 'Email contact or messaging'
  },
  'phone': {
    name: 'phone',
    category: 'communication',
    keywords: ['call', 'telephone', 'contact'],
    usage: 'Phone contact or calling'
  },
  'chat': {
    name: 'chat',
    category: 'communication',
    keywords: ['message', 'conversation', 'talk'],
    usage: 'Chat or messaging feature'
  },
  'forum': {
    name: 'forum',
    category: 'communication',
    keywords: ['discussion', 'comments', 'conversation'],
    usage: 'Discussion forums or comments'
  },

  // Content
  'description': {
    name: 'description',
    category: 'content',
    keywords: ['document', 'file', 'page', 'text'],
    usage: 'Documents or text files'
  },
  'folder': {
    name: 'folder',
    category: 'content',
    keywords: ['directory', 'files', 'organize'],
    usage: 'Folders or file organization'
  },
  'folder_open': {
    name: 'folder_open',
    category: 'content',
    keywords: ['directory', 'files', 'opened'],
    usage: 'Open folder or active directory'
  },
  'insert_drive_file': {
    name: 'insert_drive_file',
    category: 'content',
    keywords: ['file', 'document', 'upload'],
    usage: 'Generic file or document'
  },
  'picture_as_pdf': {
    name: 'picture_as_pdf',
    category: 'content',
    keywords: ['pdf', 'document', 'file'],
    usage: 'PDF documents'
  },
  'photo': {
    name: 'photo',
    category: 'content',
    keywords: ['image', 'picture', 'gallery'],
    usage: 'Photos or images'
  },
  'videocam': {
    name: 'videocam',
    category: 'content',
    keywords: ['video', 'camera', 'record'],
    usage: 'Video content or recording'
  },

  // User & Account
  'account_circle': {
    name: 'account_circle',
    category: 'user',
    keywords: ['user', 'profile', 'avatar', 'person'],
    usage: 'User profile or account'
  },
  'person': {
    name: 'person',
    category: 'user',
    keywords: ['user', 'profile', 'account', 'individual'],
    usage: 'Individual user or person'
  },
  'people': {
    name: 'people',
    category: 'user',
    keywords: ['users', 'group', 'team', 'multiple'],
    usage: 'Multiple users or team'
  },
  'lock': {
    name: 'lock',
    category: 'user',
    keywords: ['secure', 'password', 'private', 'protected'],
    usage: 'Security or locked content'
  },
  'lock_outline': {
    name: 'lock_outline',
    category: 'user',
    keywords: ['secure', 'password', 'private'],
    usage: 'Security or authentication'
  },
  'verified_user': {
    name: 'verified_user',
    category: 'user',
    keywords: ['verified', 'secure', 'authenticated'],
    usage: 'Verified or authenticated user'
  },

  // Location & Places
  'location_on': {
    name: 'location_on',
    category: 'location',
    keywords: ['pin', 'map', 'place', 'address'],
    usage: 'Location or address marker'
  },
  'place': {
    name: 'place',
    category: 'location',
    keywords: ['location', 'map', 'pin'],
    usage: 'Place or location'
  },
  'map': {
    name: 'map',
    category: 'location',
    keywords: ['location', 'geography', 'navigation'],
    usage: 'Maps or geographic navigation'
  },
  'public': {
    name: 'public',
    category: 'location',
    keywords: ['world', 'globe', 'international'],
    usage: 'Global or public content'
  },
  'home': {
    name: 'home',
    category: 'location',
    keywords: ['house', 'main', 'start'],
    usage: 'Home page or main navigation'
  },
  'business': {
    name: 'business',
    category: 'location',
    keywords: ['building', 'office', 'company'],
    usage: 'Business or organization'
  },

  // Date & Time
  'schedule': {
    name: 'schedule',
    category: 'datetime',
    keywords: ['time', 'clock', 'calendar'],
    usage: 'Schedule or time-related content'
  },
  'event': {
    name: 'event',
    category: 'datetime',
    keywords: ['calendar', 'date', 'appointment'],
    usage: 'Events or calendar dates'
  },
  'today': {
    name: 'today',
    category: 'datetime',
    keywords: ['calendar', 'current', 'now'],
    usage: 'Current date or today'
  },
  'access_time': {
    name: 'access_time',
    category: 'datetime',
    keywords: ['clock', 'time', 'schedule'],
    usage: 'Time or scheduling'
  },

  // Visibility & Display
  'visibility': {
    name: 'visibility',
    category: 'display',
    keywords: ['eye', 'show', 'view', 'visible'],
    usage: 'Show content or make visible'
  },
  'visibility_off': {
    name: 'visibility_off',
    category: 'display',
    keywords: ['eye', 'hide', 'hidden', 'invisible'],
    usage: 'Hide content or make invisible'
  },
  'zoom_in': {
    name: 'zoom_in',
    category: 'display',
    keywords: ['magnify', 'enlarge', 'increase'],
    usage: 'Zoom in or enlarge'
  },
  'zoom_out': {
    name: 'zoom_out',
    category: 'display',
    keywords: ['reduce', 'shrink', 'decrease'],
    usage: 'Zoom out or reduce size'
  },

  // Status & Indicators
  'star': {
    name: 'star',
    category: 'status',
    keywords: ['favorite', 'rating', 'important'],
    usage: 'Favorites or ratings'
  },
  'star_outline': {
    name: 'star_outline',
    category: 'status',
    keywords: ['favorite', 'rating', 'unfilled'],
    usage: 'Unfavorite or unrated'
  },
  'flag': {
    name: 'flag',
    category: 'status',
    keywords: ['mark', 'report', 'bookmark'],
    usage: 'Flag or mark content'
  },
  'bookmark': {
    name: 'bookmark',
    category: 'status',
    keywords: ['save', 'mark', 'favorite'],
    usage: 'Bookmark or save for later'
  },
  'help': {
    name: 'help',
    category: 'status',
    keywords: ['question', 'support', 'info'],
    usage: 'Help or support information'
  },
  'help_outline': {
    name: 'help_outline',
    category: 'status',
    keywords: ['question', 'support', 'tooltip'],
    usage: 'Help tooltip or info'
  }
};

export const ICON_CATEGORIES = {
  alerts: 'Alerts & Messaging',
  navigation: 'Navigation',
  actions: 'Actions',
  communication: 'Communication',
  content: 'Content',
  user: 'User & Account',
  location: 'Location & Places',
  datetime: 'Date & Time',
  display: 'Visibility & Display',
  status: 'Status & Indicators'
};
