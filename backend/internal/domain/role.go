package domain

type Role string

const (
	RoleMahasiswa Role = "mahasiswa"
	RoleHRD       Role = "hrd"
	RoleProdi     Role = "prodi"
	RoleAdmin     Role = "admin"
)

func (r Role) Valid() bool {
	switch r {
	case RoleMahasiswa, RoleHRD, RoleProdi, RoleAdmin:
		return true
	default:
		return false
	}
}
