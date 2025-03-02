import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [user, setUser] = useState(null);
  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  // Check token validity on page load
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get("https://mern-crud-inventory-management.onrender.com/api/auth/validate", {
          withCredentials: true,
        });
        if (response.data.valid) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error("Token validation failed:", err);
      }
    };

    validateToken();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("https://mern-crud-inventory-management.onrender.com/api/items", {
        withCredentials: true,
      });
      setItems(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async () => {
    try {
      await axios.post("https://mern-crud-inventory-management.onrender.com/api/items", newItem, {
        withCredentials: true,
      });
      setNewItem({ name: "", description: "" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const updateItem = async (id) => {
    try {
      const updatedItem = { ...newItem };
      await axios.put(`https://mern-crud-inventory-management.onrender.com/api/items/${id}`, updatedItem, {
        withCredentials: true,
      });
      setNewItem({ name: "", description: "" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://mern-crud-inventory-management.onrender.com/api/items/${id}`, {
        withCredentials: true,
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isSignUp
      ? "https://mern-crud-inventory-management.onrender.com/api/auth/signup"
      : "https://mern-crud-inventory-management.onrender.com/api/auth/signin";
    try {
      const response = await axios.post(url, authData, {
        withCredentials: true,
      });
      if (response.data.message) {
        setUser(authData.username);
        setError("");
      }
      setAuthData({ username: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://mern-crud-inventory-management.onrender.com/api/auth/logout", {}, {
        withCredentials: true,
      });
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  if (!user) {
    return (
      <div style={styles.authContainer}>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleAuth} style={styles.authForm}>
          <input
            type="text"
            placeholder="Username"
            value={authData.username}
            onChange={(e) =>
              setAuthData({ ...authData, username: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={authData.password}
            onChange={(e) =>
              setAuthData({ ...authData, password: e.target.value })
            }
            style={styles.input}
          />
          <button type="submit" style={styles.authButton}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={styles.toggleButton}
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Item Management System</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      <main style={styles.main}>
        <h2>Items List</h2>
        <ul style={styles.list}>
          {items.map((item) => (
            <li key={item._id} style={styles.listItem}>
              <span style={styles.itemText}>
                {item.name} - {item.description}
              </span>
              <div>
                <button
                  style={{ ...styles.button, ...styles.deleteButton }}
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
                <button
                  style={{ ...styles.button, ...styles.editButton }}
                  onClick={() => setNewItem(item)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div style={styles.form}>
          <h2>Add/Edit Item</h2>
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            style={styles.input}
          />
          <div>
            <button
              style={{ ...styles.button, ...styles.addButton }}
              onClick={addItem}
            >
              Add Item
            </button>
            <button
              style={{ ...styles.button, ...styles.updateButton }}
              onClick={() => updateItem(newItem._id)}
            >
              Update Item
            </button>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2023 Item Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ItemList;

// Basic CSS styles
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "1rem",
    textAlign: "center",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    borderBottom: "1px solid #ddd",
  },
  itemText: {
    flex: 1,
  },
  form: {
    marginTop: "2rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    margin: "0.5rem 0",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "0.5rem 1rem",
    margin: "0.5rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#28a745",
  },
  updateButton: {
    backgroundColor: "#ffc107",
  },
  editButton: {
    backgroundColor: "#17a2b8",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  footer: {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "1rem",
    marginTop: "auto",
  },
  authContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
  },
  authButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  toggleButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#17a2b8",
    cursor: "pointer",
    marginTop: "1rem",
  },
  error: {
    color: "#dc3545",
    marginBottom: "1rem",
  },
};
