'use client';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';

export default function Home() {
  const [list, setList] = useState([]);
  const [todo, setTodo] = useState('');
  const [hidden, setHidden] = useState({ id: '', hidden: '' });
  const [update, setUpdate] = useState('');
  const fetch = async () => {
    const data = await axios.get('http://localhost:5000/api/list');
    setList(data.data);
    console.log(data.data);
  };
  useEffect(() => {
    fetch();
  }, []);

  const del = async (e: any) => {
    try {
      const text = e;
      console.log(text);
      await axios.delete(`http://localhost:5000/api/delete/${text}`);
      console.log('Successfully deleted');
      // Fetch the updated list after deletion
      await fetch();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const add = async () => {
    try {
      await axios
        .post('http://localhost:5000/api/todo', { todo: todo })
        .then(() => console.log('succefully added todo'));

      setTodo(''); // Clear input value
      // Fetch the updated list after addition
      await fetch();
    } catch (error) {
      console.log('error adding todo', error);
    }
  };

  const updatetodo = async () => {
    try {
      await axios
        .put(`http://localhost:5000/api/update/${hidden.id}`, {
          todo: update,
        })
        .then(() => console.log('Successfully added todo'));

      setUpdate(''); // Clear input value
      // Fetch the updated list after addition
      setHidden({ id: '', hidden: '' });
      fetch();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-white py-5 text-5xl font-semibold text-center">
          Todo List
        </h1>
        <div className="py-5">
          <div className="h-16   flex justify-center">
            <form
              className="h-full mx-1 flex max-sm:w-full "
              onSubmit={() => {
                add();
              }}
            >
              <input
                onChange={(e) => setTodo(e.target.value)}
                value={todo}
                className="h-full w-52  md:w-64 text-black text-2xl px-2"
                placeholder="Add todo"
                type="text"
              />{' '}
              <button
                className="h-full md:mx-1 bg-slate-700 w-full md:w-24 text-2xl font-bold"
                type="submit"
              >
                Add
              </button>
            </form>
          </div>
          <div className="py-5">
            {list.length === 0 ? (
              <div className="flex justify-center italic">
                <h2>No record</h2>
              </div>
            ) : (
              list.map((e: any) => (
                <div
                  className="transition-all delay-100 duration-[2s] mx-auto flex justify-between my-3 py-3 rounded-lg text-2xl px-5 md:w-[25%] bg-white text-black"
                  key={e._id}
                >
                  <div
                    className={hidden.id === e._id ? hidden.hidden : 'w-5 h-5'}
                  >
                    {e.complete === true ? (
                      <input
                        checked
                        readOnly
                        className="rounded-full w-5 h-5"
                        type="checkbox"
                      />
                    ) : (
                      <input
                        onClick={async () => {
                          await axios
                            .patch(`http://localhost:5000/api/patch/${e._id}`)
                            .then(() => console.log('hero'))
                            .catch((error) => console.log(error));
                          fetch();
                        }}
                        className={
                          'rounded-full w-5 h-5  ' + hidden.id === e._id
                            ? hidden.hidden
                            : 'w-5 h-5'
                        }
                        type="checkbox"
                      />
                    )}
                  </div>
                  <div
                    className={
                      e.complete === true
                        ? 'line-through'
                        : hidden.id === e._id
                        ? hidden.hidden
                        : ''
                    }
                  >
                    {e.text}
                  </div>
                  <div
                    className={
                      'flex ' + hidden.id === e._id ? hidden.hidden : ''
                    }
                  >
                    <button
                      className={hidden.id === e._id ? hidden.hidden : ''}
                      onClick={() => {
                        setHidden({ id: e._id, hidden: 'hidden' });
                        setUpdate(e.text);
                      }}
                      type="button"
                    >
                      <EditNoteIcon />
                    </button>{' '}
                    <button
                      className={hidden.id === e._id ? hidden.hidden : ''}
                      onClick={() => del(e._id)}
                      type="button"
                    >
                      <DeleteForeverIcon />
                    </button>
                  </div>
                  <div
                    className={
                      hidden.id === e._id ? ' h-full float-left flex' : 'hidden'
                    }
                  >
                    <form
                      className="flex"
                      onSubmit={(e) => {
                        e.preventDefault();
                        updatetodo();
                      }}
                    >
                      <input
                        className="w-52 h-10 px-2 mx-4 border-2 border-black"
                        onChange={(e) => setUpdate(e.target.value)}
                        value={update}
                        type="text"
                      />{' '}
                      <button
                        type="submit"
                        className="text-lg font-semibold md:px-3  -my-1 rounded-lg bg-slate-600 text-white"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
