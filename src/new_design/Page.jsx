import { useApp } from "../AppProvider";
import House from '../img/nomadic-julien-rV8ihhCauO0-unsplash.jpg';

const details = {
  page: 'about',
  title: 'About The Clergymen',
  rows: [
    {
      cols: 2,
      contents: [
        {
          type: 'text',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non augue sem. Curabitur tortor lacus, lacinia facilisis augue nec, lobortis dictum elit. Aliquam posuere tincidunt ligula. Suspendisse turpis odio, ornare sed tristique eu, sagittis commodo neque. Aliquam erat volutpat. In tincidunt ut lorem ut congue. Pellentesque commodo non tortor non mollis.'
        },
        {
          type: 'image',
          value: 'https://place-puppy.com/300x300'
        }
      ]
    },
    {
      cols: 2,
      contents: [
        {
          type: 'image',
          value: House
        },
        {
          type: 'text',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non augue sem. Curabitur tortor lacus, lacinia facilisis augue nec, lobortis dictum elit. Aliquam posuere tincidunt ligula. Suspendisse turpis odio, ornare sed tristique eu, sagittis commodo neque. Aliquam erat volutpat. In tincidunt ut lorem ut congue. Pellentesque commodo non tortor non mollis.'
        }
      ]
    },
    {
      cols: 2,
      contents: [
        {
          type: 'row',
          value: {
            cols: 2,
            contents: [
              {
                type: 'image',
                value: 'https://place-puppy.com/200x200'
              },
              {
                type: 'image',
                value: 'https://place-puppy.com/200x200'
              }
            ]
          }
        },
        {
          type: 'image',
          value: 'https://place-puppy.com/400x400'
        }
      ]
    }
  ]
}

function Row (props) {
  return (
    <div className={`row cols-${props.row.cols}`}>
      {
        props.row.contents.map (col => (
          <div className={col.type}>
            {col.type === 'text' && <p>{col.value}</p>}
            {col.type === 'image' && <img src={col.value} />}
            {col.type === 'row' && <Row row={col.value} />}
          </div>
        ))
      }
    </div>
  )
}

export default function Page () {
  const app = useApp ();

  if (app.pages.editing || !app.pages.currentPage) return null;

  return (
    <main>
      <h1>{app.pages.currentPage.title}</h1>
      {
        app.pages.currentPage.rows.map (row => (
          <Row row={row} />
        ))
      }
    </main>
  )
}