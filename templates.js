var response = {
  name: 'MySite',
  welcome_text: 'Helo Nymph User',
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
    ]}
  ]
}


window.dataset['root'] = response