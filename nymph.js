class SymchElem extends HTMLElement {}

window.customElements.define('s-yn', SymchElem);

var Synch = function(parent, name, data) {
  this.name = name
  this.data = data
  this.parent = parent
  this.trace_back = function(child_refs) {
    if(!this.traceback)
      return(child_refs)
    else
      return this.parent.traceback(name + child_refs)
  }
  this.generate_pointer = function() {
    return this.trace_back('', this.name)
  }
  this.pointer = this.generate_pointer()
  this.node = function() {
    return(data.constructor != Object && data.constructor != Array)
  }

  this.infect = function() {
    var synch_obj = this
    if(this.data && this.data.constructor == Array) {
      synch_obj.children = []
      $.each(this.data, function(i, data) {
        synch_obj.children.push(new Synch(synch_obj, i, data))
        synch_obj.children[i].infect()
      })
    }
    else if(this.data && this.data.constructor == Object) {
      synch_obj.children = {}
      $.each(this.data, function(key, data) {
        synch_obj.children[key] = new Synch(synch_obj, key, data)
        synch_obj.children[key].infect()
      })
    }
  }
}

var data = {
  name: 'MySite',
  welcome_text: 'Helo Synch User',
  footer_text: 'Quit'
}

e = new Synch(data, 'root', data)
e.infect()