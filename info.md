git checkout main
git pull origin main            
git checkout -b mahesh_branch 
git add .
git commit -m "Mahesh changes"
git push origin mahesh_branch
git checkout main
git pull origin main  
git merge mahesh_branch 
git push origin main