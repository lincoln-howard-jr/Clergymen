import { useApp } from "../AppProvider";
import {H1, H3} from '../components/Headers'
import PlaySVG from '../img/play.svg'
import PauseSVG from '../img/pause.svg'

export default function Episodes () {
  
  const {auth: {user}, router: {page, redirect}, episodes: {episodes}, setPodcast, podcastId, podcastPlaying, togglePlay} = useApp ();

  if (page !== '/Clergymen/?page=episodes') return '';
  return (
    <>
      <div className="text-center">
        <H1>Episodes:</H1>
        {
          user &&
          <a onClick={redirect ('/Clergymen/?page=create-episode')}>Add Episode</a>
        }
      </div>
      <main>
        {
          episodes.map (episode => (
            <div className="character-card">
              <div className="character-played-by">
                <header>
                  <H3>{episode.title}{podcastId === episode.id && ' - Playing'}</H3>
                  {
                    podcastId === episode.id && podcastPlaying &&
                    <img className="invert" onClick={togglePlay} src={PauseSVG} />
                  }
                  {
                    podcastId === episode.id && !podcastPlaying &&
                    <img className="invert" onClick={togglePlay} src={PlaySVG} />
                  }
                  {
                    podcastId !== episode.id &&
                    <img className="invert" onClick={setPodcast (episode)} src={PlaySVG} />
                  }
                </header>
                <hr style={{margin: '25px 25%'}} />
                {
                  user &&
                  <div className="text-center">
                    <a onClick={redirect (`/Clergymen/?page=edit-episode&id=${episode.id}`)}>Edit</a>
                  </div>
                }
              </div>
              <div className="character-info">
                <H3 short={`S${episode.seasonNumber}, E${episode.episodeNumber}`}>Season {episode.seasonNumber}, Episode {episode.episodeNumber}</H3>
                <span>{episode.longDescription}</span>
              </div>
              {
                (episode.coverPhoto && episode.coverPhoto.url) &&
                (
                  <div className="character-image">
                    <img src={`https://d1q33inlkclwle.cloudfront.net/${episode.coverPhoto.url}`} />
                  </div>
                )
              }
            </div>
          ))
        }
      </main>
    </>
  )

}