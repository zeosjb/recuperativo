import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const apiUrl = "https://jsonplaceholder.typicode.com/posts";

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    post: {
      userId: "",
      id: "",
      title: '',
      description: ''
    },
    selectedId: "",
    searchTerm: ""
  };

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts = () => {
    const { searchTerm }= this.state;

    if (searchTerm) {
      axios.get(apiUrl, { params: { search: searchTerm } })
        .then(response => {
          this.setState({ data: response.data });
        })
        .catch(error => {
          console.log(error.message);
        });
    }

    axios.get(apiUrl)
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  createPost = async () => {
    const { post } = this.state;
    
    await axios.post(apiUrl, post)
      .then(response => {
        this.modalInsertar();
        this.fetchPosts();
        this.setState({
          post: {
            title: "",
            body: "",
            userId: ""
          }
        });
      })
      .catch(error => {
        if (error.response && error.response.data) {
          console.log("Error:", error.response.data);
        } else {
          console.log("Error:", error.message);
        }
      });
  }

  updatePost = () => {
    const { post, selectedId } = this.state;

    axios.put(apiUrl + "/" + selectedId, post)
      .then(response => {
        this.modalInsertar();
        this.fetchPosts();
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  deletePost = () => {
    const { selectedId } = this.state;

    axios.delete(apiUrl + "/" + selectedId)
      .then(response => {
        this.setState({ modalEliminar: false, selectedId: "" });
        this.fetchPosts();
      })
      .catch(error => {
        console.log(error.message);
      });
  }
  

  modalInsertar = () => {
    this.setState(prevState => ({
      modalInsertar: !prevState.modalInsertar,
      tipoModal: 'insertar',
      post: {
        title: "",
        body: "",
        userId: ""
      }
    }));
  }

  selectPost = post => {
    axios.get(apiUrl + "/" + post.id)
      .then(response => {
        const selectedPost = response.data;
        this.setState({
          selectedId: post.id,
          tipoModal: 'actualizar',
          post: {
            id: selectedPost.id,
            title: selectedPost.title,
            body: selectedPost.body,
            userId: selectedPost.userId
          }
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  };  

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({
      searchTerm: value
    });

    this.fetchPosts();

    this.setState(prevState => ({
      post: {
        ...prevState.post,
        [name]: value
      }
    }));
  }  

  render() {
    const { post } = this.state;

    return (
      <div className="App">
        <br></br>
        <div className="header">
          <h2>Posts</h2>
            <button className="btn btn-success" onClick={() => { this.setState({ post: { title: "", body: "", userId: "" }, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Body</th>
              <th>User Id</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(post => {
              return (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.body}</td>
                  <td>{post.userId}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.selectPost(post); this.modalInsertar() }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.selectPost(post); this.setState({ modalEliminar: true }) }}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            {this.state.tipoModal === 'insertar' ? 'Ingresar' : 'Editar'}
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="code">Title</label>
              <input className="form-control" type="text" name="id" id="id" onChange={this.handleChange} value={post.title} />
              <br />
              <label htmlFor="name">Body</label>
              <input className="form-control" type="text" name="title" id="title" onChange={this.handleChange} value={post.body} />
              <br />
              <label htmlFor="description">User Id</label>
              <input className="form-control" type="text" name="userId" id="userId" onChange={this.handleChange} value={post.userId} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={this.state.tipoModal === 'insertar' ? this.createPost : this.updatePost}>
              {this.state.tipoModal === 'insertar' ? 'Agregar' : 'Editar'}
            </button>
            <button className="btn btn-danger" onClick={this.modalInsertar}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Estás seguro de que deseas eliminar el Post {post && post.title}?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.deletePost()}>Sí</button>
            <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

export default App;

