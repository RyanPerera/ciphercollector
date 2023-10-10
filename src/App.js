import { useState, useEffect } from 'react'
import './App.css'
import BasicModal from './Components/BasicModal';
import SearchBar from './Components/SearchBar';
import logo from './Assets/header_logo.png'
import ComboBox from './Components/ComboBox';
import TablePagination from '@mui/material/TablePagination';
import supabase from './supabase';
import ProfileMenu from './ProfileMenu';
import { setSelector, variantSelector } from './Components/selectOptions'

const App = () => {
  const [user, setUser] = useState(null)
  const [uid, setUid] = useState("")
  const [rows, setRows] = useState([])
  const [coll, setColl] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [search, setSearch] = useState("lyn or lethe or mia or dimitri or marth");

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user)
      if (data.session != null) {
        setUid(data.session.user.id)
        getCollection(data.session.user.id)
      }
    }

    async function getData() {
      const { data } = await supabase.from('cipherdb')
        .select('id, Name, Set, Color, Rarity, Imagefile, imagefiledb(Url), Class, Type, Range, Attack, Support, Skill1, Skill2, Skill3, Skill4')
        .textSearch('Name', `${search}`, {
          type: 'websearch',
          config: 'english'
        });
      setRows(data);
    }

    async function getCollection(id) {
      const { data } = await supabase.from('collections')
        .select('card')
        .eq('user', id)
      setColl(data);
    }

    getSession()
    getData()
  }, [uid, search]);


  function removeCard(id) {
    setColl(coll => coll.filter((e) => e.card !== id))
  }
  function addCard(id) {
    setColl(coll => [...coll, { card: id }])
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const login = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider: provider
    })
  }

  const logout = async (provider) => {
    await supabase.auth.signOut()
    console.log("Logged out from ", user?.user_metadata.full_name)
    window.location.reload(false);
  }


  return (
    <div className='app' >
      <div className='profilemenu'>
        <ProfileMenu name={user?.user_metadata.full_name} logout={logout} />
      </div>
      <button onClick={() => login("google")}>Login with Gmail</button>
      <button onClick={() => login("github")}>Login with Github</button>

      <div className='header'>
        <img src={logo} alt="logo" />
      </div>

      <div className='optionbox'>
        <SearchBar search={search} setSearch={setSearch} />
        <ComboBox label="Set" selector={setSelector} width={100} />
        <ComboBox label="+ Variants" selector={variantSelector} width={300} />
      </div>

      <div className='quickinfo'>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[25, 50, 100, { label: 'All', value: -1 }]}
          labelRowsPerPage="Cards per page:"
        />
      </div>

      <div className='cardlist'>

        {rows ? rows.map((row, idx) => {
          if (((idx >= (page * rowsPerPage)) && (idx < (rowsPerPage * (page + 1)))) || rowsPerPage === -1) {
            return (
              <BasicModal
                key={row.id}
                id={row.id}
                name={row.Name}
                set={row.Set}
                color={row.Color}
                rarity={row.Rarity}
                num={row.Imagefile}
                url={row.imagefiledb.Url}
                skill1={row.Skill1}
                skill2={row.Skill2}
                skill3={row.Skill3}
                skill4={row.Skill4}
                user={uid}
                have={coll.some(e => e.card === row.id)}
                removeCard={removeCard}
                addCard={addCard}
              />
            )
          }
          else {
            return false;
          }
        }
        )
          : ""}

      </div>

    </div >

  )
}

export default App