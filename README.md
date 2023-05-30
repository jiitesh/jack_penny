# Money_Splitter
A web based App which split the MoneyAn web Based Application which is used for split money between your friends and also you can chat with them.You can also pay the due amount by this platform. You can also give feedback to our team to improvise ourselves and if you find any mistakes
or have a great idea that has to be implemented in this platform you can suggest that too.

The activities in the app :-
## 1. Registration_Page
This Page is used for user registration. A user will register using his first name, last name, email-id, phone no.
and ofcourse password. On successful registration he is directed to MainLogin_page.

## 2. MainLogin_Page
This Page is used for user login and is the first activity when we start the app.
We have also a Manager login where admin can login and see the feedbacks.
A user can login using his email-id and password. On successful login he is directed to Friend Dashboard where you have to 
add friend and create a group.

## 3. Add Friend
This activity will appear after you click the 'Add Friend' option on the dashboard. Here you have to mention the friend email-id to add it
in your database.
Also friend email-id has to be in database (means they also use the platform if they are not register to this then an invitation mail is gone)

## 4. Create Group
This activity will appear after you click the 'Ad group' option on the dashboard. Here you have to mention the group name and its description
what this group is about.And when you submit this details your Groups are shown in list as below-
After click on particular group you will redirected to that group name dashboard.

## 5. Add Member
This activity will appear after you click the 'Add group' option on the dashboard.Here you have to just enter the mail-id of that friend
that is already in your dashboard means the thing which we done in #3 step. Firstly you have to add that particular friend in your system
in Add Friend step and then that friend add in your group if it is present already.

## 5. Add Bill
This activity will appear after you click the 'Add Bill' option on the dashboard. Here you have to mention the Note(what this bill is about)
, its amount, split between and those amounts. Then the bill is added to your dashboard as well as your fried dashboard.
If you lent the money to your friend then bill on dashboard has sign (+) in your dashboard and (-) on your friends dashboard.
(+) means your friend has to pay the due amount and vice-versa.

## 7. Settle Up and Payment
By this button all the bills are settled automatically if you have cash payment then simply click on that button it settled all the
bills and also there is option to pay there and if you pay online then after succesful payment it automatically settle up the amount
if pay in full.

## To run this Prject on your system-
1. You have mongodb on your system.
2. You have NodeJs install on your system.
On cmd line where this project is installed first run mongod
then npm start or nodemon(if you have that on you pc).







