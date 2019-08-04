window.nymph_partials = {
  post: `
      <div class='post'>
        {{title}}
        <div class='comments' type="partial" partial="comment" collection="comments">
        </div>
      </div>
    `,
  posts: `
      <div class="posts">
        <div type="partial" collection="posts" partial="post">

        </div>
      </div>
    `,
  comment: `
      <div class='comment'>
        {{author}}
        {{text}}
      </div>
    `
}
