import { useState, useEffect } from 'react'
import './App.css'
import BasicModal from './Components/BasicModal';
import SearchBar from './Components/SearchBar';
import logo from './Assets/header_logo.png'
//import ComboBox from './Components/ComboBox';
import MultiBox from './Components/MultiBox';
import TablePagination from '@mui/material/TablePagination';
import supabase from './supabase';
import ProfileMenu from './Components/ProfileMenu';
import { setSelector, colourSelector, raritySelector } from './Components/selectOptions'

const url = process.env.NODE_ENV === "development"
  ? "http://localhost:3000/"
  : "https://ryanperera.github.io/ciphercollector/";

const App = () => {
  const [user, setUser] = useState(null)
  const [uid, setUid] = useState("")
  const [rows, setRows] = useState([])
  const [coll, setColl] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)

  const [search, setSearch] = useState("")
  const [set, setSet] = useState("")
  const [rarity, setRarity] = useState("")
  const [colour, setColour] = useState("")

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
      let query = supabase.from('cipherdb')
        .select('id, Name, Set, Color, Rarity, Imagefile, imagefiledb(Url), Class, Type, Range, Attack, Support, Skill1, Skill2, Skill3, Skill4')

      if (search) {
        query = query.ilike('Name', `%${search}%`);
      }

      if (set) {
        query = query.in('Set', set.split(", "));
      }

      if (rarity) {
        query = query.in('Rarity', rarity.split(", "));
      }

      if (colour) {
        query = query.in('Color', colour.split(", "));
      }

      const { data } = await query;
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
    setPage(0)
  }, [uid, search, set, colour, rarity]);


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
      provider: provider,
      options: { redirectTo: url }
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
        <MultiBox label="Set" selector={setSelector} width={300} setSet={setSet} />
        <MultiBox label="Colour" selector={colourSelector} width={300} setColour={setColour} />
        <MultiBox label="Rarity" selector={raritySelector} width={300} setRarity={setRarity} />
      </div>

      <div className='quickinfo'>
        <TablePagination
          component="div"
          count={rows ? rows.length : 0}
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