const REMOTE_URL = "localhost";

const WEB_SOCKET_HOST = REMOTE_URL;
const WEB_SOCKET_PORT = "8134";

const LANGUAGE_DEFAULT = "en";

const ClientSensibility = createEnum(["NONE", "ONLY_REDIRECT", "IP_MATCH"]);
const ExtractVideoDirectUrlMessage = createEnum(["DOWNLOADING_URL", "FILE_NOT_AVAILABLE", "EXTRACTING_LINK", "FORMATTING_RESULT"]);
