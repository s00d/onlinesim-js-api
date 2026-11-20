# Free numbers

> Public numbers and their SMS — client.free. No API key needed.

## list

Countries, the numbers of the selected country and the SMS of the selected number, in one call.

```ts
list(options?: { country?: number; number?: string; page?: number; count?: number }): Promise<FreeList>
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        country
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      <code>
        44
      </code>
      
       (server)
    </td>
    
    <td>
      Country code; an unknown one falls back to the first available.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      first number
    </td>
    
    <td>
      Number <strong>
        without
      </strong>
      
       the country code, as the keys of <code>
        numbers
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        page
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      <code>
        1
      </code>
    </td>
    
    <td>
      Page of <code>
        messages
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      server default
    </td>
    
    <td>
      SMS per page, 10–500.
    </td>
  </tr>
</tbody>
</table>

`FreeList`:

- `countries`: `{ country, country_text, country_original }[]`
- `numbers`: `Record<string, { country, country_original, full_number, data_humans, is_archive }>`, keyed by the short number
- `messages`: a paginator of `{ id, text, in_number, my_number, code, created_at, data_humans }` plus `number` and `country`; `code` is `-` when no code was found

```ts
const { numbers } = await client.free.list({ country: 44 })
const short = Object.keys(numbers)[0]
if (short) {
  const { messages } = await client.free.list({ country: 44, number: short, count: 20 })
  for (const sms of messages.data) console.log(sms.in_number, sms.code, sms.text)
}
```
