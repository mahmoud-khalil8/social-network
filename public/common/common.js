var timer;
var cropper;
var selectedUsers = [];
$(document).ready(() => {
    refreshMessagesBadge();
    refreshNotificationsBadge();
})


$("#postTextarea,#replyTextArea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    
    var isModal=textbox.parents(".modal").length==1
    var submitButton = isModal? $("#submitReplyButton"):$("#submitPostButton");

    if(submitButton.length == 0) return alert("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
})
$("#exampleModalLong").on("show.bs.modal",(event)=>{
    
    var button = $(event.relatedTarget);
    var postId=getPostIdFromElement(button)
    $('#submitReplyButton').data("id",postId)
    $.get(`/api/posts/${postId}`, results => {
        outputPosts(results.postData, $("#postsContainer"));
    })

})

$("#exampleModalLong").on("hidden.bs.modal",(event)=>{
    $("#postsContainer").html("")


})
$("#deleteExampleModalLong").on("show.bs.modal",(event)=>{
    var button = $(event.relatedTarget);
    var postId=getPostIdFromElement(button)
    $('#submitDeleteButton').data("id",postId)


})
$("#deleteExampleModalLong").click((event)=>{
    var id=$(event.target).data("id")
    $.ajax({
        url: `/api/posts/${id}`,
        type: "DELETE",
        success: (postData) => {
            location.reload();
        }
    })
})

$("#fileInput").change(function(){
    // var input=$(event.target);
    if(this.files && this.files[0]){
        var reader=new FileReader();
        reader.onload=(e)=>{
            var image=document.getElementById("imagePreview");
            image.src=e.target.result;

            //$("#imagePreview").attr("src",image.src);
            if(cropper !== undefined){
                cropper.destroy();
            }
            cropper=new Cropper(image,{
                aspectRatio:1/1,
                background:false
            })

        }  
        reader.readAsDataURL(this.files[0]);
    }

})
$("#coverPhoto").change(function(){
    // var input=$(event.target);
    if(this.files && this.files[0]){
        var reader=new FileReader();
        reader.onload=(e)=>{
            var image=document.getElementById("coverPreview");
            image.src=e.target.result;

            //$("#imagePreview").attr("src",image.src);
            if(cropper !== undefined){
                cropper.destroy();
            }
            cropper=new Cropper(image,{
                aspectRatio:16/9,
                background:false
            })

        }  
        reader.readAsDataURL(this.files[0]);
    }

})

$("#submitPostButton ,#submitReplyButton").click(() => {
    var button = $(event.target);

    var isModal = button.parents(".modal").length == 1;
    var textbox = isModal ? $("#replyTextArea") : $("#postTextarea");

    var data = {
        content: textbox.val()
    }

    if (isModal) {
        var id = button.data().id;
        if(id == null) return alert("Button id is null");
        data.replyTo = id;
    }
    $.post("/api/posts", data, postData => {

        if(postData.replyTo) {
            emitNotification(postData.replyTo.postedBy);
            location.reload();

        }
        else {
            var html = createPostHtml(postData);
            $(".postsContainer").prepend(html);
            textbox.val("");
            button.prop("disabled", true);
        }
    })
})
$(document).on("click", ".likeButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);
    
    if(postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            
            button.find("span").text(postData.likes.length || "");

            if(postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
                    emitNotification(postData.postedBy);
            }
            else {
                button.removeClass("active");
            }

        }
    })

})
$(document).on("click", "#imageUploadButton", (event) => {

    var canvas = cropper.getCroppedCanvas();
    if(canvas == null) {
        return alert("Could not upload image. Make sure it is an image file.");
    }

    canvas.toBlob((blob) => {
        var formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/api/users/profilePicture",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => location.reload()
        })
    })
})
$(document).on("click", "#coverPhotoButton", (event) => {

    var canvas = cropper.getCroppedCanvas();
    if(canvas == null) {
        return alert("Could not upload image. Make sure it is an image file.");
    }

    canvas.toBlob((blob) => {
        var formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/api/users/coverPhoto",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => location.reload()
        })
    })
})
$(document).on("click", ".retweetButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);  
    if(postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: "POST",
        success: (postData) => {            
            button.find("span").text(postData.retweetUsers.length || "");

            if(postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active");
                emitNotification(postData.postedBy);

            }
            else {
                button.removeClass("active");
            }
              location.reload();
        }
    })
})
$(document).on("click", ".post", (event) => {
    var element = $(event.target);
    var postId = getPostIdFromElement(element);

    if(postId !== undefined && !element.is("button")) {
        window.location.href = `/post/${postId}`;
    }

})
$(document).on("click", ".notification.active", (event) => {
    var container = $(event.target);
    var notificationId = container.data().id;
    var href = container.attr("href");
    event.preventDefault();
    var callback = () => window.location=href
    //mark it as opened first then redirect to the href link 
    markNotificationsAsOpened(notificationId, callback);
})
$(document).on("click", ".followButton", (event) => {
    var button = $(event.target);
    var userId = button.data().user;
    $.ajax({
        url: `/api/users/${userId}/follow`,
        type: "PUT",
        success: (data,status,xhr) => {
            if(xhr.status==404){
                return alert("User not found")
            }

            var difference = 1;
             if(data.following && data.following.includes(userId)) {
                 button.addClass("following");
                    button.text("Following");
                    emitNotification(userId);
             }
            else {
                    button.removeClass("following");
                    button.text("Follow");
                    difference = -1;
            }
            var followersLabel = $("#followersValue");
            if(followersLabel.length != 0) {
                var followersText=followersLabel.text();
                followersText=parseInt(followersText);
                followersLabel.text(followersText+difference); 
            }
            location.reload();
        }
    })
})
$("#userSearchTextbox").keydown((event) => {
    clearTimeout(timer);
    var textbox = $(event.target);
    var value = textbox.val();



    // Check for backspace key
    if (event.key === "Backspace") {
        if(value === ""){
            
            selectedUsers.pop();
            updateSelectedUsersHtml();
            $(".resultsContainer").html("");
            
        }
        if(selectedUsers.length==0){
            $("#createChatButton").prop("disabled", true);
        }

        return;
    }
    
    timer = setTimeout(() => {
        value = textbox.val().trim();
        
        if (value === "") {
            $(".resultsContainer").html("");
        } else {
            searchUsers(value);
        }
    }, 1000);
    
});
$("#createChatButton").click((event)=>{
    var data=JSON.stringify(selectedUsers);
    $.post("/api/chats",{users:data},(chat)=>{
        if(!chat || !chat._id) return alert("Invalid response from server");
        window.location.href=`/messages/${chat._id}`;
    })

})
function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("Post id undefined");

    return postId;
}

function createPostHtml(postData,largeFont=false) {

    if(postData == null) return alert("post object is null");
    var largeFontClass=largeFont?"largeFont":"";
    var isRetweet = postData.retweetData.length>0;
    var retweetedBy = isRetweet ? postData.postedBy.username : null;
    postData = isRetweet ? postData.retweetData[0] : postData;

    
    var postedBy = postData.postedBy;

    if(postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    var likeActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    var retweetActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    var retweetTxt="" ;
    if(isRetweet){
        retweetTxt=`                                    <i class='fas fa-retweet'></i>
                    <span>Retweeted by <a href='/profile/${retweetedBy}'> @${retweetedBy}</span>`
    }
    var replyFlag=""
    if(postData.replyTo&& postData.replyTo._id !== undefined) {
        if(!postData.replyTo._id) {
            return alert("Reply to is not populated");
        }
        else if(!postData.replyTo.postedBy._id) {
            return alert("Posted by is not populated");
        }
        var replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}<a>
                    </div>`;
    }

    var buttons=""
    if(postData.postedBy._id==userLoggedIn._id){
        buttons=`<button class='close trash' ,data-id="${postData._id}" data-toggle="modal" data-target="#deleteExampleModalLong"><i class='far fa-trash-alt'></i></button>
              `
    }

    return `<div class='post ${largeFontClass}' data-id=${postData._id} >
                <div class='abovePost'>
                ${retweetTxt}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='/${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button data-toggle="modal" data-target="#exampleModalLong">
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer blue'>
                                <button class='retweetButton ${retweetActiveClass}'>
                                    <i class='fas fa-retweet'></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
function outputPosts(results, container) {
    container.html("");
    if(!Array.isArray(results)) {
        results = [results];
    }
    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}
function outputPostsWithReplies(results, container) {
    container.html("");

    if(results.replyTo !== undefined && results.replyTo._id !== undefined) {
        var html = createPostHtml(results.replyTo)
        container.append(html);
    }

    var mainPostHtml = createPostHtml(results.postData,true)
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });
}
function outputUsers(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createUserHtml(result, true);
        container.append(html);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>No results found</span>")
    }
}

function createUserHtml(userData, showFollowButton) {

    var name = userData.firstName + " " + userData.lastName;
    var isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
    var text = isFollowing ? "Following" : "Follow"
    var buttonClass = isFollowing ? "followButton following" : "followButton"

    var followButton = "";
    if (showFollowButton && userLoggedIn._id != userData._id) {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                        </div>`;
    }

    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='../../${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div>
                ${followButton}
            </div>`;
}
function searchUsers(searchTerm) {
    $.get("/api/users", { search: searchTerm }, results => {
        outputSelectableUsers(results, $(".resultsContainer"));
    })
}
function outputSelectableUsers(results, container) {
    container.html("");

    results.forEach(result => {
        if(result._id == userLoggedIn._id || selectedUsers.some(u => u._id == result._id)) {
            return;
        }
        var html = createUserHtml(result, false);
        var element = $(html);
        element.click(()=>{
            userSelected(result);
        })
        container.append(element);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>No results found</span>")
    }
}
function userSelected(user) {
    selectedUsers.push(user);
    updateSelectedUsersHtml();
    $("#userSearchTextbox").val("").focus();
    $(".resultsContainer").html("") ;
    $("#createChatButton").prop("disabled", false);

}
function updateSelectedUsersHtml(){
    var elements=[]
    selectedUsers.forEach(user=>{
        var name=user.firstName+" "+user.lastName;
        var userElement=$(`<span class='selectedUser'>${name}</span>`)
        elements.push(userElement)
    })
    $(".selectedUser").remove();
    $("#selectedUsers").prepend(elements);
}
function getChatName(chatData) {
    var chatName = chatData.chatName;

    if(!chatName) {
        var otherChatUsers = getOtherChatUsers(chatData.users);
        var namesArray = otherChatUsers.map(user => user.firstName + " " + user.lastName);
        chatName = namesArray.join(", ")
    }

    return chatName;
}

function getOtherChatUsers(users) {
    if(users.length == 1) return users;

    return users.filter(user => user._id != userLoggedIn._id);
}
function messageReceived(newMessage){
    if($(".chatContainer").length==0){
        showMessagePopup(newMessage);
    }
    else{
        addChatMessageHtml(newMessage)
    }
    refreshMessagesBadge();
}
function markNotificationsAsOpened(notificationId=null, callback=null){
    if(callback==null) callback=()=>location.reload();
    console.log(notificationId)
    var url=notificationId!=null?`/api/notifications/${notificationId}/markAsOpened`:`/api/notifications/markAsOpened`;
    $.ajax({
        url:url,
        type:"PUT",
        success:()=>callback()
    })
}
function refreshMessagesBadge(){
    $.get("/api/chats",{unreadOnly:true},(data)=>{
        var numResults=data.length;
        if(numResults>0){
            console.log("numResults",data)
            $("#messagesBadge").text(numResults).addClass("active");
        }
        else{
            $("#messagesBadge").text("").removeClass("active");
        }
    })
}
function refreshNotificationsBadge(){
    $.get("/api/notifications",{unreadOnly:true},(data)=>{
        var numResults=data.length;
        if(numResults>0){
            $("#notificationBadge").text(numResults).addClass("active");
        }
        else{
            $("#notificationBadge").text("").removeClass("active");
        }
    })
}

function showNotificationPopup(data){
    var html=createNotificationHtml(data);
    var element=$(html);
    element.hide().prependTo("#notificationList").slideDown("fast");
    setTimeout(()=>{
        element.fadeOut(400);
    },5000)
}

function showMessagePopup(data){
    if(!data.chat.latestMessage._id){
        data.chat.latestMessage=data;
    }
    var html=createChatHtml(data.chat);
    var element=$(html);
    element.hide().prependTo("#notificationList").slideDown("fast");
    setTimeout(()=>{
        element.fadeOut(400);
    },5000)
}
function outputNotificationsList(notifications, container) {
    notifications.forEach(notification => {
        var html = createNotificationHtml(notification);
        container.append(html);
    });
    if (notifications.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>");
    }
}

function createNotificationHtml(notification) {
    var userFrom = notification.userFrom;
    var text = getNotificationText(notification);
    var href = getNotificationUrl(notification);
    var className = notification.opened ? "" : "active";

    return `<a href='${href}' class='resultListItem notification ${className}' data-id="${notification._id}">
                <div class='resultsImageContainer'>
                    <img src='/${userFrom.profilePic}'>
                </div>
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='ellipsis'>${text}</span>
                </div>
            </a>`;
}
function getNotificationText(notification){
    var userFrom=notification.userFrom ;
    if(!userFrom.firstName || !userFrom.lastName){
        return alert("user from data not populated");
    }

    var userFromName=`${userFrom.firstName} ${userFrom.lastName}` ;
    var text="" ;
    if(notification.notificationType=="retweet"){
        text=`${userFromName} retweeted one of your posts` ;
    }
    else if(notification.notificationType=="postLike"){
        text=`${userFromName} liked one of your posts` ;
    }
    else if(notification.notificationType=="reply"){
        text=`${userFromName} replied to one of your posts` ;
    }
    else if(notification.notificationType=="follow"){
        text=`${userFromName} started following you` ;
    }
    return `<span class='ellipsis'>
                ${text}
            </span>` ;
}
function getNotificationUrl(notification){
    var url="#";
    if(notification.notificationType=="retweet" || notification.notificationType=="postLike" || notification.notificationType=="reply"){
        url=`/post/${notification.entityId}` ;
    }else if(notification.notificationType=="follow"){
        url=`/profile/${notification.entityId}` ;
    }
    return url ;
}
function createChatHtml(chatData) {
    var chatName = getChatName(chatData);
    var image = getChatImageElements(chatData);
    var latestMessage = getLatestMessage(chatData.latestMessage);
    
    return `<a href='/messages/${chatData._id}' class='resultListItem'>
                ${image}
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='heading ellipsis'>${chatName}</span>
                    <span class='subText ellipsis'>${latestMessage}</span>
                </div>
            </a>`;
}

function getLatestMessage(latestMessage) {
    if(latestMessage != null) {
        var sender = latestMessage.sender;
        return `${sender.firstName} ${sender.lastName}: ${latestMessage.content}`;
    }

    return "New chat";
}

function getChatImageElements(chatData) {
    var otherChatUsers = getOtherChatUsers(chatData.users);

    var groupChatClass = "";
    var chatImage = getUserChatImageElement(otherChatUsers[0]);

    if(otherChatUsers.length > 1) {
        groupChatClass = "groupChatImage";
        chatImage += getUserChatImageElement(otherChatUsers[1]);
    }

    return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`;
}

function getUserChatImageElement(user) {
    if(!user || !user.profilePic) {
        return alert("User passed into function is invalid");
    }

    return `<img src='${user.profilePic}' alt='User's profile pic'>`;
}
