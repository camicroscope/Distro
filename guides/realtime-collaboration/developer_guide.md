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

4. Run develop.yml or caMicroscope.yml using docker-compose
```bash
## for prod
docker-compose -f caMicroscope.yml up 

## for dev
docker-compose -f develop.yml up 
```

This concludes the setup for real time collaboration system.


### File Structure

1. **Caracal**
```
-\handlers
	-\CollabRoomHandlers.js          - handlers (middlewares) for handling collaboration room requests. 
-\socketio
	-\init.sockets.js                - initialization and configuration of socket server
-\caracal.js                         - start the socket server

```

2. **Distro**
```
-\configure-jitsi.sh                 - add configurations for jitsi server.
-\develop.yml                         - .yml file for dev environment
-\develop.yml                         - .yml file for prod environment
```

3. **caMicroscope**
```
-\core
	-\socketio
		-\init.socket.js              - configure and initialize socket client
```

### Developer Guide

#### Server Side (Caracal)

- `socketio\init.sockets.js` contains the initial setup of sockets. In this file, we have initialised a server that listens to socket connections.
- The server checks for auth tokens and whether the requesting user has access to the slides. If all checks pass, the socket connection is established successfully.

![Socket server flowchart](https://lh3.googleusercontent.com/pw/AM-JKLWUhioBZenoQ7QrCiyplHhovqtpGQK5kLU59AKuT2GBJtOdM71xTmX01RkmtUnIu2WOjKc2vG38bapIWNKX77nPTVh4DFSaPS6_8mPYOagalfukbSywT0B2qMvcFmxuGD5VvwA_Y-Y5EWQKw2GH7DM2=w1062-h1372-no)


- `handlers/CollabRoomHandlers.js` contains middleware handlers to handle DB requests for manage collaboration room.
	- `permissionHandlerForCollabRooms` is used to check if the requesting client has permissions to access the specific collaboration room.
	-	`addDefaultCollabRoomOnSlideCreate` is used to create a new collaboration room entry in the database collection whenever a new slide is created. This collaboration room is automatically linked to the ID of the slide created.
	-	`removeCollabRoomOnSlideDelete` is used to delete the corresponding collaboration room when the particular slide is deleted.

- `caracal.js` contains a script that starts up the socket server at a default port of `5000`. This socket server is started in a master thread rather than a worker thread (, since in doing so solved the web sockets + docker error that was blocking cross client communication of socket channels).

#### Distro 

- `configure-jitsi.sh` contains a script that creates a `.env` and related files containing the default configuration for the jitsi server. This file can be edited as per the user's needs.
- `develop.yml` contains the configuration for all the docker containers including those required for jitsi.
	- In container `ca-back`, the exposed port `5000:5000` is for the socket server. 
	- The images for jitsi are at the very end as indicated by a comment, and these can be disabled by commenting it out in case the jitsi  feature is unneeded.

#### Client Side (caMicroscope)

- `core/socketio/init.sockets.js` contains the initialisation of the web socket client. 

![Socket client flowchart](https://lh3.googleusercontent.com/0t1kMr84gumOWGG826OxbQkdsRbX2LGKyUVgY7bgc-CjwoHWaTKtl5VXZQvCk0bw3xk-qdhb5yMMP6UPwwexJxvdOn_cW1Wwwxphu9xggMYLwcjTkF75HKcmbFn1SmV3bohwHSTZlbhhEdBqNtFrOApFL2sxiAsFLFG2JX6zp_AVaex1i_sYIz9fyUhviUpuNitBxdzQ1nSIomzANXA9refawHiHGGMkjxufccPg32WBfA6WabWSTLlYcrWXZ9biz8Zv8Tm4NI2-rfxVEg62TMSJ3GMS5V63eaYIX7Z1C4AchU-KPD-6RlC21x7u-K-9U8lpTcpI-xSoMmAJFk6qrI3tg6bym4tFbHLm8cKW1te6hBz9q3fGaWi-sGdHaAh9Bnhdgn0hxanz0u22RHGPFuI7ftjVPlxQLjm5xqPzoouyiEFDTabU9Txk0jwtf5Lq2EA-9ACGUbM5Eal8uEPzbg5Rklwxmqila9XRKP798AuYtHVMtuu6MVsjmyR7-TvF8AZglnvZUd2UMPSgKSKASWCadNPB8zEBZDATXkmXT483lomLPUoaHA7bYIEIgwKP0yg-wl83T6prOJbPFgKLmNLpTsvitlFabGeoY87WhqyHODzHbB1Q3brpWDFlANA6d1bGUdHvhqa8oASLs2EKjAweh1zWIsSdmLxNgw5b2e-ZWeYyZYoDu9ilwTkgtYCpBJOJloFqe8l_-nomnSE=w1264-h1642-no?authuser=0)

- This file also contains the request interceptor used to handle socket communications.
![Socket interceptor working](https://lh3.googleusercontent.com/Mr01bUyluWHxhKsxu-tATRikmp8njm5AnAoFj3xEiI9Ex_uCJ0hnBuR0jhCN2ej8B4lca4HOIjqbEXyFaJNxlq942D2Kkmik5W6uC4aKaiTDsA7ladAWuXn8_jZWg5HvnGq0ZSX1nrX4yaWcMQvmWBH8EKyd_3qgFWf_yJb-r9UiY_63MsE4vcW5pe0EMpnfWX3a77ZDSE2RqWw1RWpKEWC8UVIWAPrdLrw0WmDe62ZHLypiwf7MWLVz97ifV59gbNAcZMFb_375x6kFv0J5dY7sax4V1XjqFKk03Nsdk3jEE3qU1lmcXqexQkmVQv1t9Td90o6kGC_WSlJQ1-IkL24yPZ2K7mJTMnETEb8h9PMtSGauVaaQcUv4vln968VX3__9YR1TJrS_C9FwVEB6QTmE6GIe86EtMllL964yeunJd6QgivcLS70-LDyR9bjxyGTF6WUVr6ZfbuS7eCWj6Pd4hN69keUVd8orZzo7AAALkvow4Gozl8DgyWJgOJL_R2xAVA10GnJjRCJxA3GmNYdvCy-2nlzJDooDz3Q8ZpP0d-vLcDJKB3RCoGWO48FiJwkqN-sFgxapJNqnqG7OeYF4eVdnJ46BzGi8QfT5z_MmZckarCUE5r9eVNnzkJPOP9QKHR-g35zLensVEOdrbvYWB3Ve4l6rlXZ6nwlOiqP4_yNYKAuSW_5a045_BSUEcfGH3jNoLXhmM87MVn0=w651-h1121-no?authuser=0)

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

