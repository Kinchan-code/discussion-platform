export enum PathName {
  // Authentication
  LOGIN = "/login",
  REGISTER = "/register",

  // Profile
  PROFILE = "/profile",
  USER_PROTOCOLS = "/profile/protocols",
  USER_THREADS = "/profile/threads",
  USER_REPLIES = "/profile/replies",
  USER_COMMENTS = "/profile/comments",
  USER_REVIEWS = "/profile/reviews",

  // Main
  HOMEPAGE = "/",

  // Protocols
  PROTOCOLS = "/protocols",
  CREATE_PROTOCOL = "/protocols/create",
  EDIT_PROTOCOL = "/protocols/:protocolId/edit",
  ONE_PROTOCOL = "/protocols/:protocolId/:title",

  // Threads
  THREADS = "/threads",
  CREATE_THREAD = "/threads/create",
  EDIT_THREAD = "/threads/:threadId/edit",
  ONE_THREAD = "/threads/:threadId/:title",
}
