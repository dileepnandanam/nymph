partials = {}

partials['post'] = `
  <div class='post'>
    {{title}}
    <div class='comments' type="partial" partial="comment" collection="comments">
    </div>
  </div>
`

partials['posts'] = `

  <div class="posts">
    <div type="partial" collection="posts" partial="post">

    </div>
  </div>
`
partials['comment'] = `
  <div class='comment'>
    {{author}}
    {{text}}
  </div>
`