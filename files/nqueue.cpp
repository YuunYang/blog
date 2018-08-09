#include <cstdio>
#include <cstring>
#include <stdio.h>
#include <iostream>
using namespace std;
int vis[3][15], C[4], Map[4][4], Case = 0;
void Search(int cur)
{
  int i, j;
  if (cur == 4)
  {
    memset(Map, 0, sizeof(Map));
    for (i = 0; i < 4; i++)
      Map[C[i]][i] = 1;
    printf("No. %d\n", ++Case);
  }
  else
  {
    for (i = 0; i < 4; i++)
    {
      if (!vis[0][i] && !vis[1][cur - i + 4] && !vis[2][cur + i]) //判断对角线及列
      {
        cout << cur << ' ' << i << endl;
        vis[0][i] = 1;
        vis[1][cur - i + 4] = 1;
        vis[2][cur + i] = 1;
        C[cur] = i;
        Search(cur + 1);
        //改回出口
        vis[0][i] = 0;
        vis[1][cur - i + 4] = 0;
        vis[2][cur + i] = 0;
      }
    }
  }
}
int main()
{
  memset(vis, 0, sizeof(vis));
  Search(0);
  return 0;
}