class Sherbert {
  constructor(flavor, cone, topping) {
    this.flavor = flavor;
    this.cone = cone;
    this.topping = topping;
  }
}
class UI {
  static displaySherberts() {
    const sherberts = Store.getSherberts();

    sherberts.forEach((sherbert) => UI.addSherbertToList(sherbert));
  }

  static addSherbertToList(sherbert) {
    const list = document.querySelector('#sherbert-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${sherbert.flavor}</td>
      <td>${sherbert.cone}</td>
      <td>${sherbert.topping}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteSherbert(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#sherbert-form');
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#flavor').value = '';
    document.querySelector('#cone').value = '';
    document.querySelector('#topping').value = '';
  }
}
class Store {
  static getSherberts() {
    let sherberts;
    if(localStorage.getItem('sherberts') === null) {
      sherberts = [];
    } else {
      sherberts = JSON.parse(localStorage.getItem('sherberts'));
    }

    return sherberts;
  }

  static addSherbert(sherbert) {
    const sherberts = Store.getSherberts();
    sherberts.push(sherbert);
    localStorage.setItem('sherberts', JSON.stringify(sherberts));
  }

  static removeSherbert(topping) {
    const sherberts = Store.getSherberts();

    sherberts.forEach((sherbert, index) => {
      if(sherbert.topping === topping) {
        sherberts.splice(index, 1);
      }
    });

    localStorage.setItem('sherberts', JSON.stringify(sherberts));
  }
}


document.addEventListener('DOMContentLoaded', UI.displaySherberts);
document.querySelector('#sherbert-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const flavor = document.querySelector('#flavor').value;
  const cone = document.querySelector('#cone').value;
  const topping = document.querySelector('#topping').value;
  if(flavor === '' || cone === '' || topping === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    const sherbert = new Sherbert(flavor, cone, topping);
    UI.addSherbertToList(sherbert);
    Store.addSherbert(sherbert);
    UI.showAlert('Sherbert Added', 'success');
    UI.clearFields();
  }
});

document.querySelector('#sherbert-list').addEventListener('click', (e) => {
  UI.deleteSherbert(e.target);
  Store.removeSherbert(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert('Sherbert Removed', 'success');
});
