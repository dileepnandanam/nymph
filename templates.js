var response = {
  name: 'MySite',
  welcome_text: 'Helo Synch User',
  footer_text: 'Quit',
  posts: [
    {title: 'title_1', body: 'body body', comments: [
      {author: 'author', text: 'hello'},
      {author: 'author', text: 'hello'},
      {author: 'author', text: 'hello'}
    ]},
    {title: 'title_2', body: 'body body', comments: [
      {author: 'author', text: 'hello'},
      {author: 'author', text: 'hello'},
      {author: 'author', text: 'hello'}
    ]},
    {title: 'title_3', body: 'body body', comments: [
      {author: 'author', text: 'hello'},
      {author: 'author', text: 'hello'},
      {author: 'author', text: 'hello'}
    ]}
  ]
}

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

var eval_attr_access = function(env, chain) {
  chain = chain || ''
  chain = chain.split('.')
  var data = env
  $.each(chain, function(i, attr) {
    if(attr.indexOf('[') > -1) {
      array_element_fetcher = attr.match(/(.*)\[(.*)\]/)
      accessor = array_element_fetcher[1]
      array_index = parseInt(array_element_fetcher[2])
      data = data.children[accessor].children[array_index]
    }
    else {
      if(data.children[attr])
        data = data.children[attr]
      else
        data = Missing(env, attr)
    }
  })
  return data
}


var render = function(partial, env) {
  htm = $(partial).html()
  $(partial).html(
    $(partial).html().replace(/\{\{(.*)\}\}/g, function($1,$2){
      return '<span id="' + env.trace_back() + '_' + $2 + '">' + eval_attr_access(env, $2).data + '</span>' 
    })
  )
  var new_env = env
  $.each($(partial).find('[partial]'), function(i, partial) {
    var collection = $(partial).attr('collection')
    var model = $(partial).attr('model')
    if(model) {
      var model = $(partial).attr('model')
      var nested_env = eval_attr_access(new_env, model)
      var nested_partial = partials[$(partial).attr('partial')]
      $(partial).attr('id', env.trace_back())
      $(partial).html(nested_partial)
      render($(partial), nested_env)
    }
    else if(collection) {
      var collection = $(partial).attr('collection')
      var nested_env = eval_attr_access(new_env, collection)
      var nested_partial = partials[$(partial).attr('partial')]
      $(partial).attr('id', env.trace_back())
      $.each(nested_env.children, function(i, model) {
        $(partial).append(nested_partial)
        render($(partial).children()[$(partial).children().length -1], nested_env.children[i])
      })
    }
  })
}


root_tree = new Synch({}, 'Response', response)
root_tree.infect()

$(document).ready(function() {
  render($('body'), root_tree)
})
