import { useState, useEffect } from 'react'
import './App.css'
import BasicModal from './Components/BasicModal';
import SearchBar from './Components/SearchBar';
import logo from './Assets/header_logo.png'
import ComboBox from './Components/ComboBox';

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cavrnydkhcwjgxgquyun.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const App = () => {
  const [user, setUser] = useState(null)
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState("Lyn");

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user)
    }
    getSession()
  }, [])

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from('cipherdb')
        .select('id, Name, Set, Color, Rarity, Imagefile, imagefiledb(Url), Class, Type, Range, Attack, Support, Skill1, Skill2, Skill3, Skill4')
        .textSearch('Name', `${search}`, {
          type: 'websearch',
          config: 'english'
        });
      setRows(data);
    }
    getData();
  }, [search]);

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

      <button onClick={() => login("google")}>Login with Gmail</button>
      <button onClick={() => login("github")}>Login with Github</button>
      <button onClick={logout}>Logout</button>

      {user ? <h1>Logged in as {user.user_metadata.full_name}</h1> : ""}

      <div className='header'>
        <img src={logo} alt="logo" />
      </div>
      <div className='optionbox'>
        <SearchBar search={search} setSearch={setSearch} />
        <ComboBox />
      </div>
      <div className='quickinfo'>Showing {rows.length} cards</div>
      <div className='cardlist'>

        {rows ? rows.map((row) => (
          <div className='cardbox' key={row.id} >
            <BasicModal
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
            />
          </div>
        ))
          : ""}

      </div>

    </div >

  )
}

export default App