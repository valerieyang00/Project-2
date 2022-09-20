# ThisWeekend
## Description
One of the hardest questions for me to answer has always been...what is your hobby?
This app is for people like me who wants to have productive and eventful weekends full of activities, but always wind up binging on netflix because I simply don't know what to do.
I integrated the Bored API (http://www.boredapi.com/api/activity/) to bring in random activities by category: ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"] and enable users to go through activities for inspiration and add items to their own todo list. Users are able to log their progress on each activity and once completed, they can write a review on the activity to share with others. For activities that require 2 or more participants, users have the ability to write a post to invite others (MeetUp feed)and comment on posts.
* URL: https://thisweekend-valerieyang00.koyeb.app/


## Tech Used
* Node.js - Express, Sequelize, EJS
* PostgreSQL

## Installation 
* Fork and Clone repo to your local repository
* Run `npm init -y` to initialize npm
* Open the repo and navigate to `package.json` file and see a list of npm packages listed under `dependencies` 
* Run `npm install` or `npm i` in the terminal to download of all required npm packages. `node_modules` should appear in the folder.
* Make sure `node_modules` is in the `gitignore` file before committing to remote repository

## ERDs
![ERDs](./wireframes/ERDs.png)

## RESTful Routing Chart
| HTTP METHOD  | URL | CRUD | Response           | Notes |
| -------------------- | ------------- | ---- | --------           | ----- |
| GET                  | /       | READ | List of Categories |Homepage with intro to site. Links to each Category in body. |
| GET                  | /users/new     | READ | form to sign up|  user can input their information and upload profile photo
| GET                  | /users/login| READ | form to login | User can login by providing email/password
| GET                  | /users/profile | READ | user information and photo | user can view their information and have option to - change photo, change password, and edit info
| GET | /users/profile/:userId| READ | form to edit user info | user can update email/username/city/state
| PUT | /users/profile/pw/:userId | UPDATE | update password | user can supply old password and new password to update
| DELETE | /users/profile/pw/:userId | DESTROY | delete user | user is logged out and deleted from database
PUT | /users/profile/photo/:userId | UPDATE | update profile photo| User can upload new photo for profile
GET | /:type | READ | display activity by selected category from API | user can click add/next from this page on each activity displayed
POST | /saved | CREATE | add activity to saved list | user can click "add" button to save activity 
GET | /saved/all | READ | list for all saved activities | user can view list of all activities saved by status (not started yet, in progress, completed)
GET | /saved/tostart | READ | display saved activities with status "not yet started" | user can filter by status on navbar
GET | /saved/inprogress | READ | display saved activities with status "in progress" | user can filter by status on navbar
GET | /saved/completed  | READ | display saved activities with status "completed" | user can filter by status on navbar
PUT| /saved/:activityId  | UPDATE | update status to "inprogress" or "completed" | user can make status updates by clicking "inprogress" or "completed" options under each saved activity
DELETE | /saved/:activityId   | DESTROY | delete saved activity | user can delete each saved activity in all statuses
GET | /saved/logs/:activityId | READ | display all logs posted for each activity and form to add new logs | user can view all logs with edit/delete button on each as well as form to add new log
POST | /saved/logs/:activityId | CREATE | add new log to specific activity | user fills out the form to post a new log
PUT | /saved/logs/:activityId/:logId | UPDATE | edit a log | user can edit content of log posted
DELETE | /saved/logs/:activityId/:logId | DESTROY | delete alog | user can delete any logs posted
GET | /reviews/:type | READ | display all reviews posted in each category or all | user can view reviews by all or each category by navbar dropdown
GET | /reviews/users/:userId | READ | display all reviews posted by user | user can view reviews posted by them
GET | /reviews/new/:activityId | READ | form to submit a reivew | user can fill out form to add a review for specific activity
POST | /reviews/:userId/:activityId | CREATE | post new reivew | new review posts for specified activity and user
GET | /reviews/edit/:reviewId | READ | form to edit review submitted by user| user can edit previously submitted review
PUT | /reviews/edit/:reviewId | UPDATE | update review | user review updated with information submitted through edit form
DELETE | /reviews/users/:userId/:reviewId | DESTROY | delete review | user can delete any reviews they previously submitted
GET | /feed | READ | display all posts and comments for MeetUp | user can view all posts and corresponding comments from everyone in MeetUp
GET | /feed/all?city=* | READ | display all posts that matches user's search | user can search cities to view posts matching the search 
GET | /feed/users/:userId| READ | display all posts by user | user can see their submitted posts
GET| /feed/new/:activityId| READ | form to add new post | user can post a new feed for specific activity with participant 2 or more
POST| /feed/:activityId| CREATE | new post created from info on form | user can see new post in the Feed page and My Posts
GET | /feed/edit/:feedId| READ | form to edit user's post | user can edit any posts they've previously posted
PUT | /feed/:feedId| UPDATE | edit user's post | posts are updated with info from form
DELETE | /feed/:userId/:feedId| DESTROY | delete user's post | user posts deleted
POST| /feed/comments/:feedId| CREATE | new comment added | user can see new comment posted under each post
GET | /logout | READ | delete user cookies | user is logged out

## Initial Wireframes
![Wireframes](./wireframes/wireframes.png)

## User Stories
* As a user, I want to choose which category I wish to explore for inspiration, and have the ability to swipe through activities and save ones I am interested in
* As a user, I want to be able to log/journal experiences for activities I started to do, or completed
* As a user, I want to be able to post reviews for select activities to let other users know of my experience
* As a user, I want to see what other users have done and reviewed, and any resources they have provided
* As a user, I want to be able to connect with other users in my area 


## Stretch goals accomplished
* Create forms for posting reviews (for public) once user marks an activity as completed
* Render 'reviews' feed page where all users' recommendation posts are displayed. Add filter by category
* Add swipe functionality to activities page by category
* Add social page where users can reach out to other users (search by location) for activities requiring multiple people (by using 'Participants' from API)
* Add comments section for each social feed posted - create comment model 1:M to feeds
* Extra functionalities in profile - change password (match old password, then update to new password encrypted), upload photo (during sign up) from local files, and have ability to update photo in profile


## Post-project reflection
* Approach: I brainstormed about what kind of user experience might be beneficial with the simple "activity" information provided by the API. I thought of ideas such as progress logs for user's own benefit, reviews that benefit all users, and public feed with comments section that serves social networking aspect; then built models and associations for each functionality using ERDs and RESTful routing charts.

* Takeaways: This project helped strengthen my understanding around RESTful API, CRUD operations, and working with databases using psql and sequelize. 

* Stretch goal for future: Use another API (geoapify) for user to find eateries/things to do in selected location/area as bonus aspect in finding "what to do"






