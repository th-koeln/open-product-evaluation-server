/**
 * Created by Dennis Dubbert on 07.06.18.
 */
const survey1 = {
    _id : 1,
    creationDate : new Date(),
    lastUpdate : new Date(),
    creator : user1,
    title : "Eine sehr tolle Umfrage",
    description : "Die Umfrage ist sehr toll. Sie ist so toll, dass sie einfach toll ist!",
    public : true,
    types : ["Like", "LikeDislike", "Choice", "Regulator"],
    questions : [likeQuestion, likeDislikeQuestion, choiceQuestion, regulatorQuestion],
    votes : [],
    images : []
}

const user1 = {
    firstname : "Max",
    lastname : "Mustermann"
}

const user2 = {
    firstname : "Peter",
    lastname : "Lustig"
}

const likeQuestion = {
    _id : 2,
    creationDate : new Date(),
    lastUpdate : new Date(),
    survey : survey1,
    type : "LIKE",
    items : [],
    value : "",
    description : "",
    likeIcon : {}
}

const likeDislikeQuestion = {
    _id : 3,
    creationDate : new Date(),
    lastUpdate : new Date(),
    survey : survey1,
    type : "LIKEDISLIKE",
    items : [],
    value : "",
    description : "",
    likeIcon : {},
    dislikeIcon : {}
}

const choiceQuestion = {
    _id : 4,
    creationDate : new Date(),
    lastUpdate : new Date(),
    survey : survey1,
    type : "CHOICE",
    items : [],
    value : "",
    description : "",
    choices : [],
    default : ""
}

const regulatorQuestion = {
    _id : 5,
    creationDate : new Date(),
    lastUpdate : new Date(),
    survey : survey1,
    type : "REGULATOR",
    items : [],
    value : "",
    description : "",
    labels : [],
    stepSize : 2.5,
    min : 0,
    max : 10,
    default : ""
}

const rankingQuestion = {
    _id : 6,
    creationDate : new Date(),
    lastUpdate : new Date(),
    survey : survey1,
    type : "REGULATOR",
    items : [],
    value : "",
    description : "",
}

const favoriteQuestion = {
    _id : 7,
    creationDate : new Date(),
    lastUpdate : new Date(),
    survey : survey1,
    type : "REGULATOR",
    items : [],
    value : "",
    description : "",
}

const item1 = {}

const item2 = {}

const item3 = {}

const item4 = {}

const item5 = {}

const image1 = {}

const image2 = {}

const image4 = {}

const image5 = {}

const likeIcon = {}

const dislikeIcon = {}

const choice1 = {}

const choice1Image = {}

const choice2 = {}

const choice3 = {}

const choice4 = {}