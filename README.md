# nymph_js
-------
Lite and Easy to use javasript templating with state changes.

To get started:


#page.html

    <div class="main">
        <div partial="post" collection="posts">
            //leave Nothing here
        </div>
    </div>
    
#partials.js

    window.nymph_partials = {
        post: `
            <div class="something">
                {{title}} // posts.title where posts is the attribute named collection
                {{body}}  // posts.body
                <div partial="author" model="author">
                </div>
            </div>
        `,
        author: `
             <div class="some-class">
                 {{name}} // author.name where auther is given as model attribute on the parent partial
             </div>
        `
    }
    
#load_page.js

    window.dataset = window.dataset || {}
    window.dataset['scope_name'] = {
        posts: [
          {
              title: 'New Post',
              body: 'Post Body....'
              author: {
                  name: 'Dileep Nandanam'
              }
          }
        ]
    }
    $(document).ready(function(){
        $('.main').render(data, 'scope_name')
    })
    
#update UI wirh new data
    
    $('.main').render(data, 'scope_name')
    
#To Do

Conditional rendering.

Replace html corresponding to only those nodes with changes on updation. The node dom mapings are there.
