[
.[] |
select(.data.callNumber) |
{key: .data.callNumber | split(":")[-1], value: .data.key}
]
| from_entries