eolivercoakley.github.io
========================

Project: EPIC OVERFLOW - A Stack Overflow Wrapper
Author: Emmett Coakley - eolivercoakley@gmail.com
Components:
    -AngularJS
    -jQuery v2.1.1
    -Bootstrap 3.0
    -TagCloud - (jQuery Plugin - https://github.com/addywaddy/jquery.tagcloud.js)
    -Stack Exchange API
    -Blizzard Entertainment - Images and Stylesheets

Description:
    This application is designed to work as a single-page interface for the Stack Exchange API. The page, when used
    in conjunction with a Stack Overflow account, will allow the user to view their profile, search for questions,
    view questions alongside their comments and answers, and mark specific questions as favorites. This site is
    designed as a single-page application using AngularJS, as well as Bootstrap.js for style and layout.

Navigation-Flow:
    Initial Launch:
        On initial launch to index.html, the user is directed to the login page, where they will be prompted to either
        login to their current Stack Exchange account or create a new one. Before doing so, the non-logged in user will
        still be able to navigate to the search and questions pages of the site. They will not be able to access home
        or favorite a question. Any attempt to access home will redirect the user to the login page.
    On Successful Login:
        Once the user is logged into their account, they will be redirected to the Home (Profile) page. Here they will be
        able to view their current profile, navigate to a favorited question, navigate to the search page (blank),
        or navigate to a search page that queries one of the user's active tags (from the tag cloud).
    Search Page:
        The search page allows the user to query the Stack Exchange API for question data. This data is then returned
        to the user and formatted in a list of panel elements, which the user can either sort or select a question
        and navigate to the full question page. Sorting options appear at the top of the page, and by clicking any of the
        header buttons will resort the question data based on the filter option. Hitting the option a second time will reverse the sort,
        for instance hitting "Titles" once will sort the list Alphabetically (Z-A). Hitting it again will reverse the order
        to (Z-A).
    Question Page:
        This page allows for the user to view a question, its comments, its answers and comments to those answers in
        addition to their respective posting times and scores. Also, the user is able to flag the question as a
        favorite by pressing clicking the star next to the question's title. Clicking an empty star will favorite
        the question, and clicking a full star will de-favorite it.

Code Design:
    By using AngularJS, the code was broken down into three separate parts: Models, Controllers, and Templates (Partials).
    Models used the factory design paradigm, and so only one instance of these objects were build and returned at application launch.
    These are used for requesting API data as well as storing unseen information such as authentication tokens and lists of
    favorited question IDs. The controllers were build to give extra functionality to the templates/views inside the main page.
    As such, there is a unique controller for each page (search, home, login, and question) as well as a general
    controller that acts in the parent scope for the entire page (including the header and footer). These controllers
    obtain data using the various models, and bind data that will be displayed or interacted with on the page. Template
    pages (partials) are the HTML code fragments that are used to display the sub pages. Each are bound to a controller
    and help display/format the UI.

Extra Notes:
    The page style is a hybrid of bootstrap and Blizzard Entertainment's storefront stylesheets. Many of the
    images were obtained from the Blizzard website.