license: MIT

Updated: 07/01/2019

This is a personal project app that allows users to document Brazilian Jiu Jitsu techniques they've learned, cross-reference them, and build sequences to drill and reference later. The repo has two submodules for deploying to two separate servers: client and server.

Technologies Used:

CRA, React, Redux, Redux-Form, Bootstrap, Mongo, Mongoose, Express, JWT, bcryptjs, Axios, Mailgun-js, Heroku, mLab

Current Features:

1.  Account Authentication and Authorization
2.  Account Verification Via E-mail
3.  Password Reset / Forgot Password
4.  Account Username, Email, and Password Updating
5.  Technique and Sequence Search, including quicksearch( All, Created by current user, liked)
6.  Send email feedback

Features to be added later:

1.  Sharing Techniques and Sequences to other users via in-app inbox or email.
2.  More svg icons to spice things up - including better styling and animations and more custom css
3.  Search filter functionality
4.  Better thumbnail compatibility - currently can only take thumbnails from Youtube videos - take thumbnails from FB links is next; Thus integration with FB dev api is next major step
5.  Possibly image uploads using cloudinary and multer.
6.  Drag & Drop Sequence editting instead of clicks.
7.  Verify Account Changes by sending email to user's email( before and after email change, if that's the change ). If user did not request change, block account and send new token to user to verify user again.


Known Bugs or Refactors necessary:

1.  Current manner of adding entries and reactions in technique editting is by actual update to server. Need to refactor to store initial values in separate object for importing each time TechForm is rendered
2.  This method is currently in use with Sequences, but is buggy and produces an error where inputs are changing from controlled to uncontrolled - need to research more on how to fix this
3.  Currently the only method of verifying if an e-mail address is deliverable is by attempting to send an email using mailgun-js. Their paid version offers its own functionality to verify instead of attempting to deliver. This is one option or I need to research another option of server-side email deliverability verification.
4.  Current method of keeping techs and seqs when users are deleted is by reassigning techs and seqs to an established user named Delete. This method works but is not ideal. Need to research other ways to keep information while respecting users desire to delete their accounts.
5.  TechniqueForm always reloads previous values after loading a technique. Initial values need to be reset; however, the manner in which this is done isn't compatible with the manner in which technique refs are added. This is a major refactor related to Refactor #1.

