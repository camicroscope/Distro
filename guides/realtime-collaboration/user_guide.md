# Getting Started Guide For Users - Real Time Collaboration in CaMicroscope


Welcome to CaMicroscope. This document aims to explain the features of Real Time Collaboration System in CaMicroscope in detail to help users get a walkthroughs of it. 


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


 - **Note**: Make sure `DISABLE_SOCKETS` is set to `false` to use real time collaboration feature

&nbsp;

### Real Time Collaboration System

1. **Configuring real time collaboration system in Table View**

- Go to table view (table.html) and it should list all available slides
	![table view default](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/table-default.png)
  

 - Click the manage collaboration button and a popup should open. Add more members to the room and click on 'Save'. (You need to have admin permissions to do this. Slide creators are by default the admins of the room)

![table view popup open](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/table-rtc-popup.png)


![table view select members](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/table-rtc-members.png)


- Once saved, you can open the popup again and edit the permission level of other users. (You need to have admin permissions to edit permission level of other members. Also any member added is by default given the role of 'contributor'). Click on 'Save' to save changes.

![table view see new members](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/table-rtc-members-2.png)

![table view update permissions](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/table-rtc-roles.png)

- You can toggle the active or inactive state of collaboration room for a slide with the toggle. Click on 'Save' once done. (This too requires admin permissions)

![table view collaboration room inactive](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/table-rtc-popup.png)

![table view collaboration room active](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/table-rtc-popup-2.png)


2. **Configuring real time collaboration system in Slide View**

- Open the collaboration popup by clicking the collaboration icon on the menu bar

![viewer view menubar collaboration icon](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/viewer-default.png)

- You can configure in the same manner as on the table view on this popup. Note that the changes require admin permissions similar to ones explained in the table view section. Click on 'Save' to save changes.

![viewer view collaboration popup](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/viewer-rtc-popup.png)


3. **Jitsi Meet in Slide View**

- Make sure you have jitsi meet containers running in the docker swarm.

- Click on the calling icon to open jitsi meet in a mini draggable window.

- Click on 'X' icon to close and leave the call.

- Click on '->' (arrow) icon to open call in a new tab. 

![viewer view jitsi meet](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/jitsi.png)

- Type in a meeting name and start the meeting, or join any existing meetings if present.

- Jitsi Meet supports various features such as:
	- Audio and Video call
	- End to end encrypted meetings
	- Password protected meetings
	- Sharing invites
	- In-call chat
	- Recording meeting
	- Sharing screen

and more as described on [Jitsi Meet](https://jitsi.org/about/).

3. **In viewer chat**

- Click on the messaging icon to open up the chat sidebar.

![in viewer chat system icon](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/chat-icon.png)

- Start typing your messages in the chat text area (at the bottom of the sidebar), and hit the enter button to send the message.

![in viewer chat sidebar](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/chat.png)

- You can search the chat by using the search field in the top of the sidebar.

![in viewer chat search](https://raw.githubusercontent.com/Vedant1202/Distro/develop/guides/realtime-collaboration/images/chat-search.png)


- Click on the messaging icon on the primary toolbar again to collapse the chat sidebar. 



