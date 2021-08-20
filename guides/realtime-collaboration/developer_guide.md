# Getting Started Guide For Developers - Real Time Collaboration in CaMicroscope


Welcome to CaMicroscope. This document aims to explain the working of Real Time Collaboration System in CaMicroscope in detail to help developers. It acts as a guide to contribute, extend, or maintain the Real Time Collboration System of the CaMicroscope project.

### Installation

1. Clone caMicroscope, Caracal, and Distro in the same parent directory
```bash
git clone https://github.com/camicroscope/caMicroscope
git clone https://github.com/camicroscope/Caracal
git clone https://github.com/camicroscope/Distro
```

2. Follow the instructions for fast local changes as provided here -> [https://github.com/camicroscope/caMicroscope#fast-local-changes](https://github.com/camicroscope/caMicroscope#fast-local-changes)

3. Go to Distro and run configure-jitsi.sh
```bash
cd Distro
./configure-jitsi.sh
```
This would  set up the jitsi config file in your project. You should see files such as `.env` in root of `distro` directory.

4. Run realtime-collab.yml using docker-compose
```bash
## for realtime server
docker-compose -f realtime-collab.yml up 

```

This concludes the setup for real time collaboration system.


### File Structure

1. **Caracal**
```
-\handlers
	-\CollabRoomHandlers.js          - handlers (middlewares) for handling collaboration room requests. 
	-\ChatHandlers.js                - handlers for in-viewer chat system.
-\socketio
	-\init.sockets.js                - initialization and configuration of socket server
-\caracal.js                         - start the socket server

```

2. **Distro**
```
-\configure-jitsi.sh                 - add configurations for jitsi server.
-\realtime-collab.yml                         - .yml file for realtime system environment
```

3. **caMicroscope**
```
-\core
	-\socketio
		-\init.socket.js              - configure and initialize socket client.
		-\handlers.sockets.js            - callback functions to handle socket events.
	-\jitsi-handlers
		-\jitsi.handler.js            - initialize and configure jitsi in-viewer calling.
```

### Developer Guide

#### Server Side (Caracal)

- `socketio\init.sockets.js` contains the initial setup of sockets. In this file, we have initialised a server that listens to socket connections.
- The server checks for auth tokens and whether the requesting user has access to the slides. If all checks pass, the socket connection is established successfully.

![Socket server flowchart](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/GSOC-21-real-time-pathology-server.png)


- `handlers/CollabRoomHandlers.js` contains middleware handlers to handle DB requests for manage collaboration room.
	- `permissionHandlerForCollabRooms` is used to check if the requesting client has permissions to access the specific collaboration room.
	-	`addDefaultCollabRoomOnSlideCreate` is used to create a new collaboration room entry in the database collection whenever a new slide is created. This collaboration room is automatically linked to the ID of the slide created.
	-	`removeCollabRoomOnSlideDelete` is used to delete the corresponding collaboration room when the particular slide is deleted.


- `handlers/ChatHandlers.js` contains middleware handlers to handle DB requests for manage collaboration room.
	- `addMessage` is used to add a message to the db for chats.
	-	`searchMessages` is used to search for message containing a particular string match in the content body of the message.
	

- `caracal.js` contains a script that starts up the socket server at a default port of `5000`. This socket server is started in a master thread rather than a worker thread (, since in doing so solved the web sockets + docker error that was blocking cross client communication of socket channels).

#### Distro 

- `configure-jitsi.sh` contains a script that creates a `.env` and related files containing the default configuration for the jitsi server. This file can be edited as per the user's needs.
- `realtime-collab.yml` contains the configuration for all the docker containers including those required for jitsi.
	- In container `ca-back`, the exposed port `5000:5000` is for the socket server. 
	- The images for jitsi are at the very end as indicated by a comment, and these can be disabled by commenting it out in case the jitsi  feature is unneeded.

#### Client Side (caMicroscope)

- `core/socketio/init.sockets.js` contains the initialisation of the web socket client. 

- `core/socketio/handlers.sockets.js` contains the callback handlers for events of the web socket client. 

![Socket client flowchart](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/GSOC-21-real-time-pathology-client.png)

- This file also contains the request interceptor used to handle socket communications.
![Socket interceptor working](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/GSOC-21-real-time-pathology.png)

- The client first checks if the socket server is active by making a request to `protocol://hostname:socket_port/socketStatus`.
- If status is active, it makes a request to the socket server to make a connection. This request contains the JWT token stored.
- Once authorised and authenticated, it establishes a connection. 
- Once connection is established, it asks to connect to the room of the corresponding slide.
- After successfully joining the room, the socket communication is active.


- `core/Store.js` contains the requests which can be modified to communicate through sockets for real time updations.
- These socket communications are done through an interceptor that is triggered only on successful response from the backend server (Caracal). 
- Currently, the feature is only active for annotations (draw tool).
- You can modify the `Store` requests to use interceptors as follows:
```javascript
// Store.js line 285

addMark(json) {
	const suffix = 'Mark/post';
	console.log('adding mark');
	const url = this.base + suffix;
	if (this.validation.mark && !this.validation.mark(json)) {
		console.warn(this.validation.mark.errors);
	}
	return fetch(url, {
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			headers: {
			'Content-Type': 'application/json; charset=utf-8',
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		body: JSON.stringify(json),
		},
		true, // Set to true for activating interceptor
		'mark' // Name/Type of event/action to be triggered
	).then(this.errorHandler);
}

```

- `/core/jitsi-handlers/jitsi.handler.js` contains the handlers and initialization functions for jitsi meetings. The meeting opens up in an in-viewer draggable window which can be further expanded to open up fully in a new tab.

	- The jitsi iframe is embedded in a div with id `jitsi-iframe'`
	- The domain on which jitsi server is running can be changed in the `domain` variable in this file
	- The options for the jitsi iframe can be changed in the `options` object in this file
	- The jitsi iframe uses Jitsi IFrame API and the relevant docs can be found here - [https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)  




