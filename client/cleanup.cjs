const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Home.jsx
replaceInFile('./src/pages/Home.jsx', [
    [/const navigate = useNavigate\(\);\n/, ''],
    [/import { useNavigate, useSearchParams }/g, 'import { useSearchParams }']
]);

// 2. Report.jsx
replaceInFile('./src/pages/Report.jsx', [
    [/const { user } = useAuth\(\);\n/, ''],
    [/import { useAuth } from '\.\.\/context\/AuthContext';\n/g, '']
]);

// 3. ItemDetails.jsx
replaceInFile('./src/pages/ItemDetails.jsx', [
    [/const navigate = useNavigate\(\);\n/, ''],
    [/import { useParams, useNavigate, Link }/g, 'import { useParams, Link }']
]);

// 4. admin/ManageUsers.jsx
replaceInFile('./src/pages/admin/ManageUsers.jsx', [
    [/import { Link } from 'react-router-dom';\n/, ''],
    [/const getStatusBadgeClass = \(status\) => {\n  if \(\!status\) return '';\n  switch \(status\) {\n    case 'active': return 'badge-success';\n    case 'suspended': return 'badge-danger';\n    default: return 'badge-secondary';\n  }\n};\n/g, '']
]);

// 5. admin/ManageItems.jsx
replaceInFile('./src/pages/admin/ManageItems.jsx', [
    [/import { useAuth } from '\.\.\/\.\.\/context\/AuthContext';\n/, ''],
    [/const timeAgo = \(datetime\) => {\n[^\}]+\};\n/g, '']
]);

// 6. admin/ManageClaims.jsx
replaceInFile('./src/pages/admin/ManageClaims.jsx', [
    [/import { useAuth } from '\.\.\/\.\.\/context\/AuthContext';\n/, ''],
    [/const formatDate = \(dateStr\) => {\n[^\}]+\};\n/g, '']
]);

// 7. admin/AdminDashboard.jsx
replaceInFile('./src/pages/admin/AdminDashboard.jsx', [
    [/import { useAuth } from '\.\.\/\.\.\/context\/AuthContext';\n/, ''],
    [/const formatDate = \(dateStr\) => {\n[^\}]+\};\n/g, '']
]);

// 8. admin/ManageCategories.jsx
replaceInFile('./src/pages/admin/ManageCategories.jsx', [
    [/} catch \(error\) {\n      alert\('Failed to add category. It might already exist.'\);\n    }/g, '} catch (error) {\n      console.error(error);\n      alert(\'Failed to add category. It might already exist.\');\n    }'],
    [/} catch \(error\) {\n      alert\('Failed to add location. It might already exist.'\);\n    }/g, '} catch (error) {\n      console.error(error);\n      alert(\'Failed to add location. It might already exist.\');\n    }'],
    [/} catch \(error\) {\n      alert\('Failed to update category'\);\n    }/g, '} catch (error) {\n      console.error(error);\n      alert(\'Failed to update category\');\n    }'],
    [/} catch \(error\) {\n      alert\('Failed to update location'\);\n    }/g, '} catch (error) {\n      console.error(error);\n      alert(\'Failed to update location\');\n    }']
]);

// 9. context/AuthContext.jsx
replaceInFile('./src/context/AuthContext.jsx', [
    [/} catch \(error\) {\n        setUser\(null\);\n      }/g, '} catch (error) {\n        console.error(error);\n        setUser(null);\n      }']
]);

console.log('Cleanup script finished.');
