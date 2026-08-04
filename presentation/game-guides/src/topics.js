// Per-topic theory content for the four CEI Labs game decks.
//
// One entry per topic. Each is a full explanation of the concept -- what it is
// and why it matters on this track -- alongside a concrete worked example, in
// the manner of the Caesar-shift walkthrough.
//
// Two hard rules, checked by build.js:
//   1. No example line may exceed EXAMPLE_MAX_COLS characters, or it silently
//      overflows the mono card.
//   2. Examples are generic textbook illustrations of the concept. None of them
//      is a working payload, path, or command for any actual level -- the point
//      is to explain the shape of the idea, not to hand over a solution.
//
// In an example block, a line beginning "# " is a comment line (rendered
// muted); everything else is rendered as literal monospace content.

const EXAMPLE_MAX_COLS = 52;

// ------------------------------------------------------------------ BANDIT --

const BANDIT = [
  {
    title: "The filesystem",
    def: "One tree, and almost everything on the machine appears somewhere in it.",
    what:
      "Linux arranges everything under a single root, /. Directories are themselves just files that list " +
      "other files. Devices, running processes and even kernel settings show up in the tree too, which is " +
      "why one small handful of tools can read almost anything on the system.",
    why:
      "Most of this track is finding a file. A name can begin with a dot and be hidden from a default " +
      "listing, begin with a dash and look like an option, or contain spaces and look like several names. " +
      "Knowing that is the difference between \"it isn't there\" and \"I haven't looked properly yet\".",
    example: [
      "# an annotated listing",
      "drwxr-xr-x   .            the directory itself",
      "-rw-r--r--   readme       an ordinary file",
      "-rw-r--r--   .quiet       dot: hidden by default",
      "-rw-r--r--   -dash        looks like an option",
      "-rw-r--r--   two words    one name, not two",
      "",
      "# the tree has one root",
      "/           the top of everything",
      "/home/you   your own corner of it",
      "/etc        system configuration",
      "/proc       running processes, as files",
    ],
    kicker: "Half of \"the file is missing\" is really \"the listing didn't show it\".",
  },
  {
    title: "Streams and pipes",
    def: "Programs read from one stream and write to another; the shell connects them.",
    what:
      "Every process is given three streams: one to read input from, one to write results to, and a " +
      "separate one for errors. A pipe joins one program's output stream directly to the next program's " +
      "input stream, so several small tools become a single larger operation with no file in between.",
    why:
      "Linux gives you very few large tools and a great many small ones. Almost every \"how do I...\" on " +
      "this track is answered by chaining three simple things together, not by finding one clever thing " +
      "that does the whole job.",
    example: [
      "# three tools, one line",
      "cat file | sort | uniq",
      "    |       |      |",
      "  read it  order  collapse repeats",
      "",
      "# the three streams",
      "stdin   what goes in",
      "stdout  the answer",
      "stderr  the complaints, kept separate",
      "",
      "# errors travel separately on purpose",
      "# so a pipe carries results, not noise",
    ],
    kicker: "If a single command can't do it, two probably can.",
  },
  {
    title: "Permissions and identity",
    def: "Every file has an owner, a group, and nine bits deciding who may do what.",
    what:
      "The characters at the start of a listing are a type flag followed by three sets of read, write and " +
      "execute permissions: one for the owner, one for the group, and one for everybody else. A process " +
      "acts with the identity of whoever started it, and may only touch what that identity is allowed to touch.",
    why:
      "\"Permission denied\" is not a dead end, it is information: you are the wrong person, and the level " +
      "is about becoming the right one. A program flagged setuid runs as its owner rather than as you, " +
      "which is precisely what makes such programs worth noticing.",
    example: [
      "# reading a permission string",
      "-  rwx  r-x  ---   owner   group",
      "|   |    |    |",
      "|   |    |    everyone else: nothing",
      "|   |    group: read, execute",
      "|   owner: read, write, execute",
      "type: - file, d directory, l link",
      "",
      "# identity is a property of the process",
      "normal program  runs as you",
      "setuid program  runs as its owner",
    ],
    kicker: "Always ask who you currently are, not just what you're trying to read.",
  },
  {
    title: "Ports, services and SSH",
    def: "A server waits on a numbered port; a client connects, and the two talk.",
    what:
      "A network service is a program waiting on a port for someone to connect to it. The port number is " +
      "only an address: nothing about it guarantees what is on the other end, or whether the conversation " +
      "is protected. SSH is one such service, giving you a shell on a remote machine over an encrypted link.",
    why:
      "Several levels amount to \"something is listening, go and talk to it\". Whether you need a plain " +
      "connection or an encrypted one is decided by the service at the far end, not by you, and the two " +
      "are not interchangeable.",
    example: [
      "# what a connection actually is",
      "you  ---->  host : port  ---->  a program",
      "     connect             that was listening",
      "",
      "# the same idea, two wrappings",
      "plain      what you send goes as-is",
      "encrypted  what you send is wrapped first",
      "",
      "# ssh is a shell at the far end,",
      "# over an encrypted connection",
      "ssh user@host -p 2220",
    ],
    kicker: "A port tells you where to knock, never who answers.",
  },
  {
    title: "Scheduled jobs",
    def: "A table of times, and commands that run when the clock matches.",
    what:
      "The system keeps a table in which every line is five time fields followed by a command. When the " +
      "clock matches all five fields the command runs -- as whichever user owns that table, not as you. " +
      "A star in a field means \"every\".",
    why:
      "Anything on a schedule runs repeatedly, unattended, as somebody else. Reading a schedule therefore " +
      "tells you two useful things at once: what is about to happen, and who it will happen as.",
    example: [
      "# five fields, then a command",
      "*  *  *  *  *   /path/to/command",
      "|  |  |  |  |",
      "|  |  |  |  day of week  (0-6)",
      "|  |  |  month        (1-12)",
      "|  |  day of month    (1-31)",
      "|  hour              (0-23)",
      "minute               (0-59)",
      "",
      "# worked examples",
      "*/5 *  *  *  *   every five minutes",
      "0   3  *  *  *   at 03:00, every day",
    ],
    kicker: "Scheduled work is somebody else's hands, moving on a timer.",
  },
  {
    title: "Git as a record",
    def: "A project's entire history, kept locally, and readable.",
    what:
      "Git stores a chain of snapshots. Each commit records what changed, when, and by whom. Branches are " +
      "alternative chains, tags are labels pinned to particular commits, and cloning copies all of it -- " +
      "including material that was later removed from the current version.",
    why:
      "The current state of a repository is only the last frame of the film. The history is a record of " +
      "everything that was ever true in it, and nothing falls out of that record just because a later " +
      "commit tidied it away.",
    example: [
      "# a history, oldest first",
      "* a1b2c3  initial commit",
      "* d4e5f6  add configuration",
      "* 7890ab  remove value from config",
      "* cdef01  tidy up",
      "",
      "# the current files no longer show it",
      "# the commit before it still does",
      "",
      "# branches and tags point at commits",
      "main   ->  cdef01",
      "v1.0   ->  d4e5f6",
    ],
    kicker: "Deleting something in the newest commit does not delete the older ones.",
  },
  {
    title: "Shells and the environment",
    def: "The shell is a program too, and it can be changed, restricted or replaced.",
    what:
      "Logging in normally starts a shell that reads your commands. Which shell runs, and what it will " +
      "permit, is configuration. A restricted shell removes capabilities; startup files execute before " +
      "you ever see a prompt; and the environment decides where commands are looked for at all.",
    why:
      "The last stretch of this track is about the shell itself rather than about files. When the " +
      "environment is working against you, the question stops being \"which command\" and becomes " +
      "\"what is actually running my command, and as what\".",
    example: [
      "# what happens before you get a prompt",
      "login  ->  startup files run  ->  shell starts",
      "               |                      |",
      "        can print, can act    may be restricted",
      "",
      "# where commands are found",
      "PATH=/usr/local/bin:/usr/bin:/bin",
      "     searched left to right,",
      "     first match wins",
      "",
      "# so the name you type and the program",
      "# that runs are not the same thing",
    ],
    kicker: "By the end of Bandit, the environment is the puzzle.",
  },
];

// ----------------------------------------------------------------- KRYPTON --

const KRYPTON = [
  {
    title: "Encoding is not encryption",
    def: "Base64 changes how bytes look. It keeps no secret at all.",
    what:
      "Encoding converts data into a different alphabet so that it survives transport -- text using only " +
      "safe characters, for instance. The transformation is fixed and public, and there is no key, so " +
      "anyone at all can undo it. Base64 turns every three bytes into four printable characters, which is " +
      "why encoded text runs about a third longer and often ends in an equals sign.",
    why:
      "Encoded data looks scrambled and is constantly mistaken for encrypted data. Telling them apart " +
      "saves you from attacking something that was never locked in the first place.",
    example: [
      "# base64, both directions",
      "plain     HELLO",
      "encoded   SEVMTE8=",
      "",
      "# how to recognise it",
      "- alphabet is A-Z a-z 0-9 + /",
      "- length is a multiple of 4",
      "- padded at the end with = or ==",
      "- roughly a third longer than the input",
      "",
      "# there is no key,",
      "# so there is nothing to break",
    ],
    kicker: "No key means no secret. It is a costume, not a lock.",
  },
  {
    title: "Substitution and the shift",
    def: "Replace every letter with another by a fixed rule. The rule is the key.",
    what:
      "The oldest family of ciphers replaces each symbol with a different one. In a shift cipher the rule " +
      "is simply \"move along the alphabet by a fixed number\", wrapping round at the end. Encrypting and " +
      "decrypting are the same operation in opposite directions, and the entire secret is that one number.",
    why:
      "It is the foundation everything else on this track builds on or reacts against. A rotation of 13 " +
      "is the same mechanism with the number fixed and published; the interesting case is when nobody " +
      "tells you the number at all.",
    special: "shift",
    kicker: "Twenty-five possible numbers is not a secret, it is a short wait.",
  },
  {
    title: "Frequency analysis",
    def: "Real language is lopsided, and substitution preserves the lopsidedness.",
    what:
      "In English some letters appear far more often than others: E and T at the top, Q and Z at the " +
      "bottom. A substitution cipher renames the letters but does nothing to how often each one occurs. " +
      "Count the symbols in the ciphertext and the commonest one is very probably standing in for E.",
    why:
      "This is the single idea that finished simple substitution as a serious method. It also explains " +
      "why a short message is safer than a long one: counts need volume before they mean anything.",
    example: [
      "# English letter frequency, roughly",
      "E  ############   12.7%",
      "T  #########       9.1%",
      "A  ########        8.2%",
      "O  #######         7.5%",
      "I  #######         7.0%",
      "...",
      "Z  #               0.1%",
      "",
      "# a substitution changes the NAMES",
      "# but not the SHAPE of the counts",
      "# so the tallest bar is probably E",
    ],
    kicker: "You are not reading the letters. You are counting them.",
  },
  {
    title: "Polyalphabetic ciphers",
    def: "Use several shifts in rotation, and the frequency counts flatten out.",
    what:
      "A Vigenere cipher takes a keyword and uses each of its letters as a shift in turn, repeating the " +
      "keyword across the message. The same plaintext letter therefore encrypts differently depending on " +
      "where it happens to sit, so counting letters no longer produces one clear answer.",
    why:
      "It defeats the previous idea head-on, and for centuries that made it look unbreakable. The " +
      "weakness that replaces the old one is repetition: the keyword restarts, again and again, at a " +
      "perfectly fixed interval.",
    example: [
      "plaintext   THESIGNALISFAINT",
      "key         KEYKEYKEYKEYKEYK",
      "ciphertext  DLCCMEXEJSWDKMLD",
      "",
      "# each position uses its own shift",
      "T + K  ->  D",
      "H + E  ->  L",
      "E + Y  ->  C",
      "",
      "# note the two Es and the three Is",
      "# do not become the same letter",
      "# so counting no longer gives one answer",
    ],
    kicker: "One key letter per position. The key is short; the message is not.",
  },
  {
    title: "Finding the key length",
    def: "If the key repeats, the ciphertext repeats -- and the gaps betray the period.",
    what:
      "When the same plaintext fragment happens to line up with the same part of the keyword, it encrypts " +
      "to the same ciphertext fragment. Measure the distance between two such repeats and the key length " +
      "must divide that distance. Do it for several repeats and the common factor stands out.",
    why:
      "Once the length is known the message splits into that many independent columns, and each column is " +
      "an ordinary single shift -- solvable by counting letters. This is the step that turns an " +
      "unbreakable-looking cipher back into one you already know how to attack.",
    example: [
      "# the same fragment, appearing twice",
      "....WXZ..........WXZ.......",
      "    ^            ^",
      "    position 4   position 20",
      "    distance = 16",
      "",
      "# another pair, distance 24",
      "# common factors of 16 and 24: 2, 4, 8",
      "# so the key is probably 4 or 8 long",
      "",
      "# then split into that many columns",
      "# each column is one simple shift",
    ],
    kicker: "Two techniques, in order: find the period, then count the letters.",
  },
  {
    title: "Stream ciphers and XOR",
    def: "Generate a long key rather than writing one down, and combine bit by bit.",
    what:
      "A stream cipher produces a keystream from a small seed and combines it with the message using XOR, " +
      "an operation that is its own inverse -- so the identical process both encrypts and decrypts. The " +
      "generator is deterministic: the same seed always produces the same keystream.",
    why:
      "This is where the classical era ends and the modern one starts. Security no longer rests on " +
      "keeping a rule hidden. It rests on the keystream being long, non-repeating, and impossible to " +
      "predict from any piece of it you happen to see.",
    example: [
      "# XOR applied twice returns the original",
      "message    1 0 1 1 0 0 1 0",
      "keystream  1 1 0 1 0 1 1 0",
      "           ----------------",
      "cipher     0 1 1 0 0 1 0 0",
      "keystream  1 1 0 1 0 1 1 0",
      "           ----------------",
      "message    1 0 1 1 0 0 1 0   <- back again",
      "",
      "# the rule is simply:",
      "# same bits -> 0 , different bits -> 1",
    ],
    kicker: "Encrypting and decrypting stop being opposites. They become the same act.",
  },
];

// ------------------------------------------------------------------- NATAS --

const NATAS = [
  {
    title: "Request and response",
    def: "HTTP is one request, one reply, and no memory of either afterwards.",
    what:
      "A browser sends a request: a method, a path, a set of headers and sometimes a body. The server " +
      "replies with a status, its own headers and some content. Then it forgets you entirely. Anything " +
      "the server needs to know next time has to be carried along in the next request.",
    why:
      "Every input on this track arrives inside one of those parts. Being able to say exactly where a " +
      "value lives -- in the path, a header, a cookie or the body -- is most of the work on most levels.",
    example: [
      "GET /index.php HTTP/1.1      <- method, path",
      "Host: target                 <- headers",
      "Cookie: session=abc123",
      "Referer: http://example/",
      "User-Agent: Mozilla/5.0",
      "                             <- blank line",
      "",
      "HTTP/1.1 200 OK              <- status",
      "Content-Type: text/html      <- headers",
      "",
      "<html>...</html>             <- body",
    ],
    kicker: "Name the part a value lives in, and you have named where to change it.",
  },
  {
    title: "The client is not a boundary",
    def: "Everything the browser does happens on your machine, under your control.",
    what:
      "The page source, the scripts, the hidden fields, the disabled buttons and the validation messages " +
      "are all delivered to you and run by you. You can read every byte of it, and you can decline to run " +
      "any of it. A request does not even have to come from a browser.",
    why:
      "A great deal of web software confuses \"the interface won't let you\" with \"it cannot happen\". " +
      "Only a check that runs on the server is a check at all. This one idea unlocks the whole track.",
    example: [
      "# what the server sent to you",
      "<input type=hidden name=price value=10>",
      "<button disabled>Submit</button>",
      "<script>if (!valid()) return;</script>",
      "",
      "# what you may do about it",
      "- read all of the source, not the page",
      "- change any value before sending it",
      "- ignore the script completely",
      "- send the request without a browser",
      "",
      "# none of the above is an exploit.",
      "# it is just using your own computer.",
    ],
    kicker: "The page is a suggestion. The request is what counts.",
  },
  {
    title: "Paths and traversal",
    def: "A path is a string the server turns into a location on disk.",
    what:
      "When a value taken from the request is used to build a filename, the server is trusting that value " +
      "to stay where it was meant to. Path syntax includes a component meaning \"go up one level\", so a " +
      "value expected to name a file can instead describe a route out of the intended directory.",
    why:
      "The flaw is not the syntax -- the syntax is doing exactly what it says. The flaw is assembling a " +
      "filesystem path out of something a stranger supplied, and never checking where it landed.",
    example: [
      "# what the developer pictured",
      "/var/www/files/  +  report.txt",
      "=  /var/www/files/report.txt",
      "",
      "# what the same syntax also permits",
      "/var/www/files/  +  ../../etc/hostname",
      "=  /etc/hostname",
      "",
      "# '..' means 'up one directory'",
      "# the server resolved it exactly as asked",
      "# and never checked the destination",
    ],
    kicker: "The server did nothing wrong. It did exactly what it was told.",
  },
  {
    title: "Cookies, headers and sessions",
    def: "A forgetful protocol remembers you by handing you something to give back.",
    what:
      "The server sets a cookie; your browser returns it on every later request. Other headers carry " +
      "similar claims -- where you came from, what browser you are, what you will accept. All of them are " +
      "simply text, stored on your machine, and sent by your machine.",
    why:
      "Anything travelling with the request can be inspected and altered. A value is trustworthy only if " +
      "the server can verify it independently, not merely because the server received it.",
    example: [
      "# the server hands you something",
      "Set-Cookie: role=guest; loggedin=0",
      "",
      "# your browser gives it back, every time",
      "Cookie: role=guest; loggedin=0",
      "",
      "# but it is your file, on your disk",
      "Cookie: role=admin; loggedin=1",
      "",
      "# other headers make claims too",
      "Referer     says where you came from",
      "User-Agent  says what you are",
      "# neither of them is proof of anything",
    ],
    kicker: "Received is not the same as verified.",
  },
  {
    title: "Input that becomes instruction",
    def: "The bug appears when a value supplied as data gets executed as a command.",
    what:
      "A program builds a command or a query by pasting a value into the middle of a string. To the " +
      "program it is one piece of text. To whatever interprets that text afterwards, part of it is a " +
      "value and part is syntax -- so if the supplied value contains syntax, it stops being data.",
    why:
      "This single shape explains command injection, SQL injection and most of the second half of this " +
      "track. Filtering particular characters is a patch on the symptom; not building instructions out of " +
      "input at all is the actual fix.",
    example: [
      "# the developer's mental model",
      "run(\"ping \" + userInput)",
      "     command       a hostname",
      "",
      "# what usually runs",
      "ping 127.0.0.1",
      "",
      "# what a shell also understands",
      "ping 127.0.0.1 ; whoami",
      "               ^ no longer a hostname",
      "",
      "# same shape, different interpreter",
      "SELECT * FROM t WHERE n = 'value'",
    ],
    kicker: "Ask on every level: where does my text stop being text?",
  },
  {
    title: "Reversible is not secret",
    def: "If it can be undone with what you already hold, it protects nothing.",
    what:
      "Encoding, compression and XOR against a fixed value all transform data without keeping a secret. " +
      "XOR is its own inverse, so if you can obtain a single matching pair of before and after, the key " +
      "falls straight out of it.",
    why:
      "Home-made \"encryption\" in web applications is nearly always one of these. Recognising a merely " +
      "reversible transformation stops you treating it as a wall and spending an hour on it.",
    example: [
      "# XOR is its own inverse",
      "data      XOR key  =  scrambled",
      "scrambled XOR key  =  data",
      "",
      "# and given any matching pair",
      "data XOR scrambled =  key",
      "                      ^ the key itself",
      "",
      "# signs there is no real secret",
      "- output length equals input length",
      "- the same input always gives the same",
      "- the transformation is in the source",
    ],
    kicker: "Scrambled and secret are not the same property.",
  },
  {
    title: "The data layer",
    def: "Behind most of the web sits a database, answering questions written as text.",
    what:
      "A query is a sentence: which columns, from which table, matching which condition. Applications " +
      "build these sentences while running, very often by joining fragments and user input into one " +
      "string. The database cannot tell which part the developer wrote and which part arrived from outside.",
    why:
      "It is the deepest floor of this track for a reason: the records are the point of the whole " +
      "building. Every level above it is a route towards here.",
    example: [
      "# the shape of a query",
      "SELECT  column    the fields you want",
      "FROM    table     where they live",
      "WHERE   name = 'value'    the condition",
      "",
      "# built by joining strings together",
      "\"... WHERE name = '\"  +  input  +  \"'\"",
      "",
      "# the quote character ends the value.",
      "# anything after it is read as more",
      "# query, not as more data.",
    ],
    kicker: "The database is not fooled. It was never told there was a difference.",
  },
];

// ------------------------------------------------------------------- AGENT --

const AGENT = [
  {
    title: "What a language model does",
    def: "It predicts the next piece of text, over and over, very quickly.",
    what:
      "A model is trained on a great deal of text and learns which continuations are likely. Given " +
      "everything so far it produces one small chunk, a token, appends it, and repeats. There is no " +
      "lookup, no stored table of facts, and no step at which it checks whether the result is true.",
    why:
      "This explains nearly every behaviour you will see from it. It is fluent because fluency is exactly " +
      "what it was optimised for -- and it is sometimes confidently wrong for precisely the same reason.",
    example: [
      "# generation, one token at a time",
      "\"The capital of France is\"   ->  \" Paris\"",
      "\"The capital of France is Paris\"  ->  \".\"",
      "",
      "# it is choosing likely, not true",
      "\"The flag for this level is\"  ->  ???",
      "",
      "     it will produce something",
      "     that LOOKS exactly like a flag,",
      "     with no way of knowing whether",
      "     it is the real one",
    ],
    kicker: "Likely and true are different targets. It is aiming at the first.",
  },
  {
    title: "Tokens and context",
    def: "The model sees a fixed-size window of text, and absolutely nothing else.",
    what:
      "Text is split into tokens, roughly word-sized pieces. Everything the model can use has to fit " +
      "inside its context window: the standing instructions, the conversation so far, and the reply it is " +
      "producing. Once the window is full, the earliest material stops being visible to it.",
    why:
      "It cannot see your screen, your files, or a session from yesterday. What you paste in genuinely is " +
      "all it has -- and a long, rambling conversation can push the important part straight back out again.",
    example: [
      "# roughly how text becomes tokens",
      "\"unbreakable\"   ->  un | break | able",
      "\"ssh\"           ->  ssh",
      "",
      "# what has to fit in the window",
      "[ instructions ][ conversation ][ reply ]",
      "|<--------- fixed total size --------->|",
      "",
      "# when it fills, the oldest drops out",
      "",
      "# practical consequence:",
      "# start a fresh chat for each level",
    ],
    kicker: "It has no memory between chats. Only what is in front of it.",
  },
  {
    title: "Running a model locally",
    def: "Size, memory and speed are one trade-off, made three times over.",
    what:
      "A model's size is counted in parameters, and its weights are stored at a chosen precision. " +
      "Reducing that precision -- quantization -- shrinks the file so it fits in ordinary memory, at some " +
      "cost to quality. The whole thing loads before it can answer, and on a CPU it thinks at roughly " +
      "reading speed rather than instantly.",
    why:
      "This is why the bootstrap picks a model to match your laptop, why the first run downloads several " +
      "gigabytes, and why answers arrive a word at a time instead of all at once.",
    example: [
      "# what the numbers mean",
      "parameters    how big the model is",
      "quantization  how precisely it is stored",
      "              smaller file, some quality lost",
      "context       how much text it can hold",
      "",
      "# the practical trade",
      "more memory  ->  bigger model  ->  better",
      "CPU only     ->  slower to answer",
      "",
      "# and the thing you gain in return:",
      "# nothing you type leaves the machine",
    ],
    kicker: "Slower, smaller, and entirely yours.",
  },
  {
    title: "Prompting",
    def: "The prompt is the whole briefing. Specific beats polite, every time.",
    what:
      "Because the output depends only on what is in the window, the levers that work are concrete ones: " +
      "state the task, name the subject, say what you have already tried, and say what sort of answer you " +
      "want back. Courtesy words change nothing at all. Asking for reasoning before a conclusion generally " +
      "produces a better conclusion.",
    why:
      "\"It didn't help\" is nearly always \"it wasn't told enough\". Naming a track and a level number is " +
      "the smallest change with the largest effect, which is exactly why a whole challenge exists for it.",
    example: [
      "# tells it almost nothing",
      "\"help\"",
      "\"this isn't working\"",
      "",
      "# tells it what it actually needs",
      "\"Help me with Bandit level 12.",
      " I can see the file but it isn't text.",
      " Explain what I should look at.",
      " Don't give me the answer.\"",
      "",
      "  task + subject + what you tried",
      "       + what you want back",
    ],
    kicker: "Please and thank you cost you nothing, and buy you nothing.",
  },
  {
    title: "Tools: how it acts",
    def: "On its own it only writes. A tool is what lets it actually do something.",
    what:
      "A plain chat model produces text and stops. An agent adds a loop: the model asks for an action, " +
      "the surrounding program really performs it, and the result is fed back into the context. The model " +
      "then reasons over genuine output from your machine instead of over its own guesses.",
    why:
      "This is the entire reason the agent connects to a challenge box, and the reason step 4 of this " +
      "track verifies a real connection rather than accepting a description of one.",
    example: [
      "# the agent loop",
      "you ask",
      "  -> model decides on an action",
      "    -> the program really runs it",
      "      -> the output goes back in",
      "        -> model reads the output",
      "          -> model answers you",
      "",
      "# the difference this makes",
      "without tools  it guesses the output",
      "with tools     it reads the output",
    ],
    kicker: "Reading real output beats predicting plausible output.",
  },
  {
    title: "Being wrong convincingly",
    def: "A confident answer and a correct answer look exactly the same.",
    what:
      "When the likely continuation is not the true one, the model gives you the likely one anyway -- in " +
      "the same tone, at the same fluency, sometimes with invented specifics attached. There is no " +
      "internal signal separating the two cases, so there is no warning of any kind.",
    why:
      "On this event that costs you twice: an invented command wastes your time, and an invented flag " +
      "wastes a submission. It is exactly why every step in this track is verified against your real " +
      "machine rather than taken on trust.",
    example: [
      "# worth checking before you trust it",
      "- does that command actually exist?",
      "- did it really print that, or is it",
      "  describing what it expects to see?",
      "- is that a path you have seen before?",
      "",
      "# what the verify tool does instead",
      "ctf-agent-verify",
      "  -> performs the real step",
      "  -> prints the flag ONLY if the step",
      "     genuinely passed on your machine",
      "# never a claim. always a check.",
    ],
    kicker: "Use it as a fast colleague who is sometimes wrong, never as an oracle.",
  },
];

module.exports = { EXAMPLE_MAX_COLS, BANDIT, KRYPTON, NATAS, AGENT };
