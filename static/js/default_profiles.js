// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

    function get_posts_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return posts_url + "?" + $.param(pp);
    }

    self.get_posts = function () {
        $.getJSON(get_posts_url(0, 4), function (data) {
            self.vue.posts = data.posts;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            enumerate(self.vue.posts);
        })
    };

   self.get_more = function () {
        var num_tracks = self.vue.posts.length;
        $.getJSON(get_posts_url(num_tracks, num_tracks + 4), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.posts, data.posts);
            enumerate(self.vue.posts);

        });
    };


     function get_posts_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return posts_url + "?" + $.param(pp);
    }


    self.update_post = function () {
        // The submit button to update a a has been added.
        $.post(upd_post_url,
            {
                post_content: self.vue.form_post_content
            },
            function (data) {
                $.web2py.enableElement($("#add_track_submit2"));
                self.vue.posts.unshift(data.posts);
                enumerate(self.vue.posts);
            });
    };


    self.add_post_button = function () {
        // The button to add a track has been pressed.
        if(self.vue.logged_in)
            self.vue.is_adding_post = !self.vue.is_adding_post;
    };

    self.add_post = function () {
        // The submit button to add a track has been added.
        $.post(add_post_url,
            {
                post_content: self.vue.form_post_content,
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                enumerate(self.vue.posts);
            });
    };



    self.is_out = function(post_author){ 
        if(post_author == current_user) 
            return true
     };


    self.delete_post = function(post_idx) {
        $.post(del_post_url,
            { post_id: self.vue.posts[post_idx].id },
            function () {
                self.vue.posts.splice(post_idx, 1);
                enumerate(self.vue.posts);
            }
        )
    };



    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            has_more: false,
            is_adding_post: false,
            posts: [],
            logged_in: false,
            form_post_content: null,
        },
        methods: {
            update_post: self.update_post,
            get_posts: self.get_posts,
            get_more: self.get_more,
            add_post_button: self.add_post_button,
            add_post: self.add_post,
            is_out:self.is_out,
            delete_post: self.delete_post,
        }

    });




    $("#vue-div").show();


    return self;
};

var APP = null;

jQuery(function(){APP = app();});
