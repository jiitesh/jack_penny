# Money_Splitter
Web Based Application which is used to split the money between your friends, chat within the group using socket.io, pay the due amount on this platform, and give feedback to our team to improvise.

# 1. Authentication
Register using first name, last name, email-id, phone no, and password. On successful registration, the user will be directed to MainLogin_page.
There exists a user login and a manager login. A user can log in using an email id and password. On successful login, the user is directed to Dashboard to add friends and create groups.

## 2. Add Friend
Click the 'Add Friend' option on the dashboard. Friend email-id has to be in the database (i.e. must be a registered user. If not facilities to invite through email have been enabled).

## 3. Create Group
Click the 'Add group' option on the dashboard. Mention the group name and its description. Submit these details to your Groups as prompted. The user will be redirected to the group dashboard if a click event is performed on the created group.

## 4. Add Member
Add members to the created group. Only registered users in your friend list can be added as group members. A bar feature to choose a member has been implemented.

## 5. Add Bill
Mention a Note(what this bill is about), The amount, split between and those amounts. Then the account is added to your dashboard as well as your friend's dashboard.
If you had lent the money to your friend then the bill on the dashboard has sign (+) in your dashboard and (-) on your friend's dashboard.
(+) means your friend has to pay the due amount and vice-versa.

## 7. Settle Up and Payment
All the bills are settled automatically if you have a cash payment then simply click on that button to settle all the bills or else there is an option to pay online. After successful payment, the bill is settled if there are no pending payments.

## To run this project on your system-
1. install MongoDB compass, node js, handlebars, node-mon, and the rest based on the requirements specified.
2. run mongod then npm start or nodemon index.js.







