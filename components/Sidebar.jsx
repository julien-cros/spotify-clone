import React, { useState, useEffect } from 'react'
import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, RssIcon, HeartIcon } from '@heroicons/react/outline'
import { signOut, useSession, getSession } from 'next-auth/react'
import useSpotify  from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';


export default function Sidebar() {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [ playlists, setPlaylists ] = useState([]);
	const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

	useEffect(() => {
		if (spotifyApi.getAccessToken()){
			spotifyApi.getUserPlaylists().then((data) => {
				setPlaylists(data.body.items);
			})
		}
	}, [session, spotifyApi])

	return (
	<div className='text-gray-500 p-5 pb-36 text-sx border-r border-gray-900 overflow-y-scroll 
		h-screen scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex'>
		<div className='space-y-4'>
		
			<button className="flex items-center space-x-2 hover:text-white">
				<HomeIcon  className="h-5 w-5"/>
				<p>Home</p>
			</button>
			<button className="flex items-center space-x-2 hover:text-white">
				<SearchIcon  className="h-5 w-5"/>
				<p>Search</p>
			</button>
			<button className="flex items-center space-x-2 hover:text-white">
				<LibraryIcon  className="h-5 w-5"/>
				<p>Library</p>
			</button>
			<hr className="border-t-[0.1px] border-gray-900 "/>

			<button className="flex items-center space-x-2 hover:text-white">
				<PlusCircleIcon  className="h-5 w-5"/>
				<p>Create Playlist</p>
			</button>
			<button className="flex items-center space-x-2 hover:text-white">
				<HeartIcon className="h-5 w-5"/>
				<p>Liked Songs</p>
			</button>
			<button className="flex items-center space-x-2 hover:text-white">
				<RssIcon  className="h-5 w-5"/>
				<p>Your Episodes</p>
			</button>
			<hr className="border-t-[0.1px] border-gray-900 "/>
			 {playlists?.map((playlist) => (
				 <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className='cursor-piointer hover:text-white'>{playlist.name}</p>
			 ))}
		</div>
	</div>
  )
}
